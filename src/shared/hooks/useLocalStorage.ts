import { useState, useEffect, useCallback, useMemo } from 'react';

// Утилиты для прямого доступа к localStorage (только на клиенте)
export const localStorageUtils = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Добавляем метод для проверки доступности localStorage
  isAvailable: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};

// Оптимизированный хук для использования localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Состояние для хранения значения
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Проверяем доступность localStorage при монтировании
  useEffect(() => {
    setIsAvailable(localStorageUtils.isAvailable());
  }, []);

  // Функция для получения значения из localStorage
  const getValue = useCallback((): T => {
    if (!isAvailable) {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, isAvailable]);

  // Функция для установки значения в localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (!isAvailable) {
      return;
    }

    try {
      // Позволяем value быть функцией, чтобы у нас была та же логика, что и useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, isAvailable]);

  // Функция для удаления значения из localStorage
  const removeValue = useCallback(() => {
    if (!isAvailable) {
      return;
    }

    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isAvailable]);

  // Загружаем значение из localStorage при монтировании компонента
  useEffect(() => {
    if (isAvailable) {
      setStoredValue(getValue());
      setIsLoaded(true);
    }
  }, [isAvailable, getValue]);

  // Мемоизируем возвращаемые значения
  const result = useMemo(() => ({
    value: storedValue,
    setValue,
    removeValue,
    isLoaded,
    isAvailable,
  }), [storedValue, setValue, removeValue, isLoaded, isAvailable]);

  return result;
}

// Хук для работы с несколькими ключами localStorage одновременно
export function useMultiLocalStorage<T extends Record<string, any>>(keys: T) {
  const [values, setValues] = useState<T>(keys);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsAvailable(localStorageUtils.isAvailable());
  }, []);

  useEffect(() => {
    if (isAvailable) {
      const loadedValues = { ...keys };
      
      Object.keys(keys).forEach(key => {
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            loadedValues[key as keyof T] = JSON.parse(item);
          }
        } catch (error) {
          console.error(`Error reading localStorage key "${key}":`, error);
        }
      });
      
      setValues(loadedValues);
      setIsLoaded(true);
    }
  }, [isAvailable, keys]);

  const setValue = useCallback((key: keyof T, value: T[keyof T]) => {
    if (!isAvailable) return;
    
    try {
      setValues(prev => ({ ...prev, [key]: value }));
      window.localStorage.setItem(String(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${String(key)}":`, error);
    }
  }, [isAvailable]);

  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    if (!isAvailable) return;
    
    try {
      setValues(prev => ({ ...prev, ...newValues }));
      Object.entries(newValues).forEach(([key, value]) => {
        window.localStorage.setItem(key, JSON.stringify(value));
      });
    } catch (error) {
      console.error('Error setting multiple localStorage values:', error);
    }
  }, [isAvailable]);

  const clearValues = useCallback(() => {
    if (!isAvailable) return;
    
    try {
      setValues(keys);
      Object.keys(keys).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage values:', error);
    }
  }, [isAvailable, keys]);

  return {
    values,
    setValue,
    setMultipleValues,
    clearValues,
    isLoaded,
    isAvailable,
  };
}

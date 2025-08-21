# Исправление localStorage для SSR/SSG в Next.js

## Проблема
При билде Next.js проекта возникала ошибка:
```
"ReferenceError: localStorage is not defined"
```

Это происходит потому, что localStorage доступен только в браузере, а не на сервере.

## Решение

### 1. Создан кастомный хук useLocalStorage

Файл: `src/shared/hooks/useLocalStorage.ts`

Хук предоставляет безопасный способ работы с localStorage:
- Автоматически проверяет доступность `window`
- Возвращает `initialValue` на сервере
- Обрабатывает ошибки
- Предоставляет утилиты для прямого доступа

### 2. Исправлены файлы с localStorage

#### `src/shared/api/axios.ts`
- Заменен прямой вызов `localStorage.getItem` на `localStorageUtils.getItem`
- Добавлена проверка на клиентскую среду

#### `src/entities/auth/hooks/useAuth.ts`
- Все обращения к localStorage заменены на `localStorageUtils`
- Добавлены проверки `typeof window !== 'undefined'` для cookies

#### `src/shared/components/RoleGuard.tsx`
- Заменен `window.location.pathname` на `usePathname()` из Next.js
- Убрана зависимость от браузерного API

#### `src/shared/ui/sidebar.tsx`
- Добавлена проверка `typeof window !== 'undefined'` для `document.cookie`

#### `src/shared/hooks/use-mobile.ts`
- Добавлена проверка `typeof window === 'undefined'` в useEffect

### 3. Исправлены файлы с window.location.reload()

Созданы функции-обертки с проверкой на клиентскую среду:

- `src/app/dashboard/page.tsx` - заменен `window.location.href` на `router.push`
- `src/app/admin/products/page.tsx` - добавлена функция `handleRetry`
- `src/app/admin/categories/page.tsx` - добавлена функция `handleRetry`
- `src/app/admin/menu/page.tsx` - добавлена функция `handleRetry`
- `src/app/admin/kitchen/page.tsx` - добавлена функция `handleRetry`
- `src/app/kitchen/page.tsx` - добавлена функция `handleRetry`
- `src/widgets/pos-page/ui/POSPage.tsx` - добавлена функция `handleRetry`

## Принципы исправления

1. **Проверка среды**: Всегда проверяем `typeof window !== 'undefined'` перед обращением к браузерным API
2. **Кастомные хуки**: Используем `useLocalStorage` для безопасной работы с localStorage
3. **Утилиты**: Используем `localStorageUtils` для прямого доступа к localStorage
4. **Next.js API**: Предпочитаем `useRouter`, `usePathname` вместо браузерных API
5. **Функции-обертки**: Создаем функции с проверками для операций типа `reload()`

## Результат

- ✅ Код не падает при билде
- ✅ SSR/SSG работает корректно
- ✅ Функциональность в браузере сохранена
- ✅ Добавлена обработка ошибок
- ✅ Улучшена типизация

## Использование

### Для localStorage:
```typescript
import { useLocalStorage, localStorageUtils } from '@/shared/hooks/useLocalStorage';

// В компоненте
const { value, setValue, removeValue } = useLocalStorage('key', 'default');

// Прямой доступ
const token = localStorageUtils.getItem('token');
localStorageUtils.setItem('token', 'value');
```

### Для проверки среды:
```typescript
if (typeof window !== 'undefined') {
  // Браузерный код
  document.cookie = 'key=value';
  window.location.reload();
}
```

### Для навигации:
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/path'); // вместо window.location.href
```

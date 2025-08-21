"use client";
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export default function TestAPIPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Успешно: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ Ошибка ${response.status}: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Ошибка сети: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Тест API</h2>
          <p className="mt-2 text-sm text-gray-600">
            Тестирование API аутентификации
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin или cashier"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Пароль
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123 или cashier123"
                className="mt-1"
              />
            </div>

            <Button
              onClick={testLogin}
              disabled={loading || !username || !password}
              className="w-full"
            >
              {loading ? 'Тестирование...' : 'Тест логина'}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p><strong>Тестовые учетные данные:</strong></p>
              <p>admin / admin123</p>
              <p>cashier / cashier123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

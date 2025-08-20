const axios = require('axios');

// Конфигурация
const API_BASE_URL = 'http://localhost:3000'; // URL вашего бэкенда
const TEST_TOKEN = 'your-jwt-token-here'; // Замените на реальный JWT токен

async function debugOrderCreation() {
  try {
    console.log('🔍 Отладка создания заказов...\n');

    // 1. Проверяем JWT токен
    console.log('1️⃣ Проверка JWT токена...');
    try {
      const payload = JSON.parse(Buffer.from(TEST_TOKEN.split('.')[1], 'base64').toString());
      console.log('JWT payload:', payload);
      console.log('User ID:', payload.sub);
      console.log('Location ID:', payload.location_id);
      console.log('Role:', payload.role);
    } catch (error) {
      console.error('❌ Ошибка декодирования JWT:', error.message);
      return;
    }

    // 2. Получаем столы для локации
    console.log('\n2️⃣ Получение столов для локации...');
    try {
      const tablesResponse = await axios.get(`${API_BASE_URL}/tables`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Столы получены:', tablesResponse.data.length);
      if (tablesResponse.data.length > 0) {
        console.log('Первый стол:', {
          id: tablesResponse.data[0].id,
          number: tablesResponse.data[0].number,
          location_id: tablesResponse.data[0].location_id
        });
      }
    } catch (error) {
      console.error('❌ Ошибка получения столов:', error.response?.data || error.message);
    }

    // 3. Получаем позиции меню для локации
    console.log('\n3️⃣ Получение позиций меню для локации...');
    try {
      const menuResponse = await axios.get(`${API_BASE_URL}/menu/items`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Позиции меню получены:', menuResponse.data.length);
      if (menuResponse.data.length > 0) {
        console.log('Первая позиция:', {
          id: menuResponse.data[0].id,
          name: menuResponse.data[0].name,
          location_id: menuResponse.data[0].location_id
        });
      }
    } catch (error) {
      console.error('❌ Ошибка получения позиций меню:', error.response?.data || error.message);
    }

    // 4. Получаем категории меню для локации
    console.log('\n4️⃣ Получение категорий меню для локации...');
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/menu/categories`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Категории получены:', categoriesResponse.data.length);
      if (categoriesResponse.data.length > 0) {
        console.log('Первая категория:', {
          id: categoriesResponse.data[0].id,
          name: categoriesResponse.data[0].name,
          location_id: categoriesResponse.data[0].location_id
        });
      }
    } catch (error) {
      console.error('❌ Ошибка получения категорий:', error.response?.data || error.message);
    }

    // 5. Проверяем пользователя
    console.log('\n5️⃣ Проверка пользователя...');
    try {
      const userResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Пользователь:', {
        id: userResponse.data.id,
        username: userResponse.data.username,
        role: userResponse.data.role,
        location_id: userResponse.data.location_id
      });
    } catch (error) {
      console.error('❌ Ошибка получения профиля пользователя:', error.response?.data || error.message);
    }

    console.log('\n✅ Отладка завершена!');

  } catch (error) {
    console.error('💥 Ошибка отладки:', error.message);
  }
}

// Запуск отладки
if (require.main === module) {
  debugOrderCreation();
}

module.exports = { debugOrderCreation };

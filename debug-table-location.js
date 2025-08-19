const axios = require('axios');

// Конфигурация
const API_BASE_URL = 'http://localhost:3000'; // URL вашего бэкенда
const TEST_TOKEN = 'your-jwt-token-here'; // Замените на реальный JWT токен

async function debugTableLocation() {
  try {
    console.log('🔍 Отладка проблемы с таблицами и локациями...\n');

    // 1. Проверяем JWT токен
    console.log('1️⃣ Проверка JWT токена...');
    let payload;
    try {
      payload = JSON.parse(Buffer.from(TEST_TOKEN.split('.')[1], 'base64').toString());
      console.log('JWT payload:', payload);
      console.log('User ID:', payload.sub);
      console.log('Location ID:', payload.location_id);
      console.log('Role:', payload.role);
    } catch (error) {
      console.error('❌ Ошибка декодирования JWT:', error.message);
      return;
    }

    const locationId = payload.location_id;
    const userId = payload.sub;

    // 2. Получаем все столы (без фильтрации)
    console.log('\n2️⃣ Получение всех столов (без фильтрации)...');
    try {
      const allTablesResponse = await axios.get(`${API_BASE_URL}/tables`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Всего столов в системе:', allTablesResponse.data.length);
      
      if (allTablesResponse.data.length > 0) {
        console.log('Первые 3 стола:');
        allTablesResponse.data.slice(0, 3).forEach((table, index) => {
          console.log(`  ${index + 1}. ID: ${table.id}, Номер: ${table.number}, Локация: ${table.location_id}, Активен: ${table.is_active}`);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка получения всех столов:', error.response?.data || error.message);
    }

    // 3. Получаем столы для конкретной локации
    console.log('\n3️⃣ Получение столов для локации:', locationId);
    try {
      const filteredTablesResponse = await axios.get(`${API_BASE_URL}/tables?locationId=${locationId}`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Столы для локации получены:', filteredTablesResponse.data.length);
      
      if (filteredTablesResponse.data.length > 0) {
        console.log('Столы для текущей локации:');
        filteredTablesResponse.data.forEach((table, index) => {
          console.log(`  ${index + 1}. ID: ${table.id}, Номер: ${table.number}, Локация: ${table.location_id}, Активен: ${table.is_active}`);
        });
      } else {
        console.log('⚠️ Нет столов для текущей локации!');
      }
    } catch (error) {
      console.error('❌ Ошибка получения столов для локации:', error.response?.data || error.message);
    }

    // 4. Проверяем пользователя
    console.log('\n4️⃣ Проверка пользователя...');
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

    // 5. Проверяем локацию
    console.log('\n5️⃣ Проверка локации...');
    try {
      const locationResponse = await axios.get(`${API_BASE_URL}/locations/${locationId}`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      console.log('Локация:', {
        id: locationResponse.data.id,
        name: locationResponse.data.name,
        address: locationResponse.data.address
      });
    } catch (error) {
      console.error('❌ Ошибка получения локации:', error.response?.data || error.message);
    }

    // 6. Тестируем создание заказа с первым доступным столом
    console.log('\n6️⃣ Тестирование создания заказа...');
    try {
      const filteredTablesResponse = await axios.get(`${API_BASE_URL}/tables?locationId=${locationId}`, {
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
      });
      
      if (filteredTablesResponse.data.length > 0) {
        const firstTable = filteredTablesResponse.data[0];
        console.log('Используем стол для теста:', firstTable);
        
        const testOrderData = {
          locationId: locationId,
          tableId: firstTable.id,
          orderType: "dine_in",
          waiterId: userId,
          customerName: "Тестовый клиент",
          customerPhone: "+79001234567",
          guestCount: 1,
          notes: "Тестовый заказ для отладки"
        };
        
        console.log('Тестовые данные заказа:', testOrderData);
        
        const orderResponse = await axios.post(`${API_BASE_URL}/orders`, testOrderData, {
          headers: { 
            'Authorization': `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Заказ успешно создан!');
        console.log('ID заказа:', orderResponse.data.id);
        
        // Удаляем тестовый заказ
        await axios.delete(`${API_BASE_URL}/orders/${orderResponse.data.id}`, {
          headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
        });
        console.log('🗑️ Тестовый заказ удален');
        
      } else {
        console.log('⚠️ Нет столов для тестирования создания заказа');
      }
    } catch (error) {
      console.error('❌ Ошибка тестирования создания заказа:', error.response?.data || error.message);
    }

    console.log('\n✅ Отладка завершена!');

  } catch (error) {
    console.error('💥 Ошибка отладки:', error.message);
  }
}

// Запуск отладки
if (require.main === module) {
  debugTableLocation();
}

module.exports = { debugTableLocation };

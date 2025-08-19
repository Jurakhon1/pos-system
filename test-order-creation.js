const axios = require('axios');

// Конфигурация
const API_BASE_URL = 'http://localhost:3000'; // URL вашего бэкенда
const TEST_TOKEN = 'your-jwt-token-here'; // Замените на реальный JWT токен

// Тестовые данные заказа
const testOrderData = {
  locationId: "2",
  tableId: "test-table-id", // Замените на реальный UUID стола
  orderType: "dine_in",
  waiterId: "test-waiter-id", // Замените на реальный UUID официанта
  customerName: "Тестовый клиент",
  customerPhone: "+79001234567",
  guestCount: 2,
  notes: "Тестовый заказ"
};

async function testCreateOrder() {
  try {
    console.log('Тестирование создания заказа...');
    console.log('Данные заказа:', JSON.stringify(testOrderData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/orders`, testOrderData, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Заказ успешно создан!');
    console.log('Ответ:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка создания заказа:');
    if (error.response) {
      console.error('Статус:', error.response.status);
      console.error('Данные ошибки:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Ошибка:', error.message);
    }
    throw error;
  }
}

async function testGetTables() {
  try {
    console.log('\nТестирование получения столов...');
    
    const response = await axios.get(`${API_BASE_URL}/tables`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    console.log('✅ Столы получены!');
    console.log('Количество столов:', response.data.length);
    console.log('Первый стол:', JSON.stringify(response.data[0], null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения столов:');
    if (error.response) {
      console.error('Статус:', error.response.status);
      console.error('Данные ошибки:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Ошибка:', error.message);
    }
    throw error;
  }
}

async function testGetMenuItems() {
  try {
    console.log('\nТестирование получения позиций меню...');
    
    const response = await axios.get(`${API_BASE_URL}/menu/items`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    console.log('✅ Позиции меню получены!');
    console.log('Количество позиций:', response.data.length);
    console.log('Первая позиция:', JSON.stringify(response.data[0], null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения позиций меню:');
    if (error.response) {
      console.error('Статус:', error.response.status);
      console.error('Данные ошибки:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Ошибка:', error.message);
    }
    throw error;
  }
}

// Основная функция тестирования
async function runTests() {
  try {
    console.log('🚀 Запуск тестов API...\n');
    
    // Тест 1: Получение столов
    const tables = await testGetTables();
    
    // Тест 2: Получение позиций меню
    const menuItems = await testGetMenuItems();
    
    // Тест 3: Создание заказа (если есть данные)
    if (tables.length > 0 && menuItems.length > 0) {
      // Обновляем тестовые данные реальными ID
      testOrderData.tableId = tables[0].id;
      testOrderData.waiterId = 'test-waiter-id'; // Нужен реальный ID официанта
      
      await testCreateOrder();
    } else {
      console.log('\n⚠️ Пропускаем тест создания заказа - нет данных о столах или позициях меню');
    }
    
    console.log('\n✅ Все тесты завершены!');
  } catch (error) {
    console.error('\n💥 Тесты завершились с ошибкой:', error.message);
  }
}

// Запуск тестов
if (require.main === module) {
  runTests();
}

module.exports = {
  testCreateOrder,
  testGetTables,
  testGetMenuItems,
  runTests
};

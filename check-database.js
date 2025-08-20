const mysql = require('mysql2/promise');

// Конфигурация базы данных
const dbConfig = {
  host: 'localhost',
  user: 'root', // Замените на вашего пользователя
  password: '', // Замените на ваш пароль
  database: 'smartchef' // Замените на название вашей базы
};

async function checkDatabase() {
  let connection;
  
  try {
    console.log('🔍 Проверка данных в базе...\n');
    
    // Подключаемся к базе
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Подключение к базе данных установлено\n');

    // 1. Проверяем таблицу locations
    console.log('1️⃣ Проверка таблицы locations...');
    const [locations] = await connection.execute('SELECT * FROM locations LIMIT 5');
    console.log('Локации в базе:', locations.length);
    if (locations.length > 0) {
      console.log('Первая локация:', locations[0]);
    }

    // 2. Проверяем таблицу users
    console.log('\n2️⃣ Проверка таблицы users...');
    const [users] = await connection.execute('SELECT id, username, role, location_id FROM users LIMIT 5');
    console.log('Пользователи в базе:', users.length);
    if (users.length > 0) {
      console.log('Первые пользователи:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Location: ${user.location_id}`);
      });
    }

    // 3. Проверяем таблицу tables
    console.log('\n3️⃣ Проверка таблицы tables...');
    const [tables] = await connection.execute('SELECT * FROM tables LIMIT 10');
    console.log('Столы в базе:', tables.length);
    if (tables.length > 0) {
      console.log('Первые столы:');
      tables.forEach((table, index) => {
        console.log(`  ${index + 1}. ID: ${table.id}, Номер: ${table.number}, Локация: ${table.location_id}, Активен: ${table.is_active}`);
      });
    }

    // 4. Проверяем таблицу menu_items
    console.log('\n4️⃣ Проверка таблицы menu_items...');
    const [menuItems] = await connection.execute('SELECT * FROM menu_items LIMIT 5');
    console.log('Позиции меню в базе:', menuItems.length);
    if (menuItems.length > 0) {
      console.log('Первые позиции меню:');
      menuItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id}, Название: ${item.name}, Локация: ${item.location_id}, Активна: ${item.is_active}`);
      });
    }

    // 5. Проверяем конкретную локацию (например, ID = 2)
    console.log('\n5️⃣ Проверка локации с ID = 2...');
    const [location2] = await connection.execute('SELECT * FROM locations WHERE id = ?', ['2']);
    if (location2.length > 0) {
      console.log('Локация с ID = 2:', location2[0]);
      
      // Проверяем столы для этой локации
      const [tablesForLocation2] = await connection.execute('SELECT * FROM tables WHERE location_id = ?', ['2']);
      console.log('Столы для локации 2:', tablesForLocation2.length);
      
      // Проверяем пользователей для этой локации
      const [usersForLocation2] = await connection.execute('SELECT id, username, role FROM users WHERE location_id = ?', ['2']);
      console.log('Пользователи для локации 2:', usersForLocation2.length);
      
      // Проверяем позиции меню для этой локации
      const [menuForLocation2] = await connection.execute('SELECT id, name FROM menu_items WHERE location_id = ?', ['2']);
      console.log('Позиции меню для локации 2:', menuForLocation2.length);
    } else {
      console.log('⚠️ Локация с ID = 2 не найдена!');
    }

    // 6. Проверяем UUID формат
    console.log('\n6️⃣ Проверка формата UUID...');
    const [sampleTable] = await connection.execute('SELECT id FROM tables LIMIT 1');
    if (sampleTable.length > 0) {
      const tableId = sampleTable[0].id;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tableId);
      console.log('ID стола:', tableId);
      console.log('Это UUID?', isUUID);
      console.log('Длина ID:', tableId.length);
    }

    console.log('\n✅ Проверка базы данных завершена!');

  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Соединение с базой данных закрыто');
    }
  }
}

// Запуск проверки
if (require.main === module) {
  checkDatabase();
}

module.exports = { checkDatabase };

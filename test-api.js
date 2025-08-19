// Простой тест для проверки API заказов
const testOrderCreation = async () => {
  try {
    // Тестовые данные заказа
    const orderData = {
      locationId: "123e4567-e89b-12d3-a456-426614174000",
      tableId: "9ac0554f-e6ae-4260-ad68-a3e7eebfb755",
      orderType: "dine_in",
      customerName: "Тестовый клиент",
      customerPhone: "1234567890",
      guestCount: 2,
      notes: "Тестовый заказ"
    };

    console.log('Отправляем данные заказа:', orderData);

    // Создание заказа
    const orderResponse = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Замените на реальный токен
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Ошибка создания заказа:', errorData);
      return;
    }

    const order = await orderResponse.json();
    console.log('Заказ создан успешно:', order);

    // Добавление позиции заказа
    const orderItemData = {
      menuItemId: "123e4567-e89b-12d3-a456-426614174000", // Замените на реальный ID блюда
      quantity: 2,
      specialInstructions: "Без лука"
    };

    console.log('Добавляем позицию заказа:', orderItemData);

    const itemResponse = await fetch(`http://localhost:3000/orders/${order.id}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Замените на реальный токен
      },
      body: JSON.stringify(orderItemData)
    });

    if (!itemResponse.ok) {
      const errorData = await itemResponse.json();
      console.error('Ошибка добавления позиции:', errorData);
      return;
    }

    const orderItem = await itemResponse.json();
    console.log('Позиция добавлена успешно:', orderItem);

  } catch (error) {
    console.error('Ошибка тестирования:', error);
  }
};

// Запуск теста
console.log('Начинаем тестирование API заказов...');
testOrderCreation();

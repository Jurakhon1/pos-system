// Тест формирования данных заказа
const testOrderData = () => {
  // Имитация данных формы
  const formData = {
    customerName: "Иван Иванов",
    customerPhone: "+79001234567",
    guestCount: 2,
    notes: "Без лука, острое",
    orderType: "dine_in"
  };

  // Имитация корзины
  const cartItems = [
    {
      id: "1",
      name: "Ролл Калифорния",
      price: 500,
      quantity: 2,
      menuItemId: "123e4567-e89b-12d3-a456-426614174000"
    },
    {
      id: "2", 
      name: "Суши Лосось",
      price: 300,
      quantity: 1,
      menuItemId: "456e7890-e89b-12d3-a456-426614174001"
    }
  ];

  // Имитация tableId
  const tableId = "123e4567-e89b-12d3-a456-426614174001";
  const waiterId = "c4ab6b48-a049-4883-aa50-b839660aa2c0";

  // Формирование данных заказа (как в хуке)
  const orderData = {
    locationId: "2",
    tableId: tableId || undefined,
    orderType: formData.orderType,
    waiterId: waiterId,
    customerName: formData.customerName.trim(),
    customerPhone: formData.customerPhone.trim(),
    guestCount: formData.guestCount,
    notes: formData.notes.trim() || 'Заказ через POS систему',
    items: cartItems.map(item => ({
      menuItemId: item.menuItemId || item.id.toString(),
      quantity: item.quantity,
      specialInstructions: formData.notes.trim() || undefined
    }))
  };

  console.log('=== ТЕСТ ФОРМИРОВАНИЯ ДАННЫХ ЗАКАЗА ===');
  console.log('Данные заказа:', JSON.stringify(orderData, null, 2));
  
  console.log('\n=== ПРОВЕРКА СООТВЕТСТВИЯ ПРИМЕРУ ===');
  console.log('locationId:', orderData.locationId === "2" ? '✅' : '❌');
  console.log('tableId:', orderData.tableId === "123e4567-e89b-12d3-a456-426614174001" ? '✅' : '❌');
  console.log('orderType:', orderData.orderType === "dine_in" ? '✅' : '❌');
  console.log('waiterId:', orderData.waiterId === "c4ab6b48-a049-4883-aa50-b839660aa2c0" ? '✅' : '❌');
  console.log('customerName:', orderData.customerName === "Иван Иванов" ? '✅' : '❌');
  console.log('customerPhone:', orderData.customerPhone === "+79001234567" ? '✅' : '❌');
  console.log('guestCount:', orderData.guestCount === 2 ? '✅' : '❌');
  console.log('notes:', orderData.notes === "Без лука, острое" ? '✅' : '❌');
  
  console.log('\n=== ПОЗИЦИИ ЗАКАЗА ===');
  orderData.items.forEach((item, index) => {
    console.log(`Позиция ${index + 1}:`, {
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions
    });
  });

  console.log('\n=== РЕЗУЛЬТАТ ===');
  const allFieldsMatch = 
    orderData.locationId === "2" &&
    orderData.tableId === "123e4567-e89b-12d3-a456-426614174001" &&
    orderData.orderType === "dine_in" &&
    orderData.waiterId === "c4ab6b48-a049-4883-aa50-b839660aa2c0" &&
    orderData.customerName === "Иван Иванов" &&
    orderData.customerPhone === "+79001234567" &&
    orderData.guestCount === 2 &&
    orderData.notes === "Без лука, острое";

  if (allFieldsMatch) {
    console.log('🎉 ВСЕ ПОЛЯ СООТВЕТСТВУЮТ ПРИМЕРУ!');
  } else {
    console.log('❌ ЕСТЬ РАСХОЖДЕНИЯ С ПРИМЕРОМ');
  }
};

// Запуск теста
testOrderData();

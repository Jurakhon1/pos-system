-- Проверка и исправление цен в базе данных
-- Выполнить в MySQL для исправления ошибки NaN

-- 1. Проверяем структуру таблицы menu_items
DESCRIBE menu_items;

-- 2. Проверяем типы цен в menu_items
SELECT 
  id, 
  name, 
  price, 
  CASE 
    WHEN price IS NULL THEN 'NULL'
    WHEN price = '' THEN 'EMPTY STRING'
    WHEN price = '0' THEN 'ZERO STRING'
    WHEN price = 0 THEN 'ZERO NUMBER'
    WHEN price < 0 THEN 'NEGATIVE'
    WHEN price > 10000 THEN 'TOO HIGH'
    ELSE 'OK'
  END as price_status
FROM menu_items 
LIMIT 10;

-- 3. Проверяем типы цен в order_items
SELECT 
  id, 
  order_id, 
  unit_price, 
  total_price,
  CASE 
    WHEN unit_price IS NULL THEN 'NULL'
    WHEN unit_price = '' THEN 'EMPTY STRING'
    WHEN unit_price < 0 THEN 'NEGATIVE'
    WHEN unit_price > 10000 THEN 'TOO HIGH'
    ELSE 'OK'
  END as unit_price_status,
  CASE 
    WHEN total_price IS NULL THEN 'NULL'
    WHEN total_price = '' THEN 'EMPTY STRING'
    WHEN total_price < 0 THEN 'NEGATIVE'
    WHEN total_price > 10000 THEN 'TOO HIGH'
    ELSE 'OK'
  END as total_price_status
FROM order_items 
LIMIT 10;

-- 4. Исправляем цены в menu_items (если они строки)
UPDATE menu_items 
SET price = CAST(price AS DECIMAL(10,2))
WHERE price IS NOT NULL 
  AND price != '' 
  AND price != '0'
  AND price REGEXP '^[0-9]+\.?[0-9]*$';

-- 5. Устанавливаем цены по умолчанию для NULL значений
UPDATE menu_items 
SET price = 0.00
WHERE price IS NULL OR price = '';

-- 6. Проверяем, что все цены корректны
SELECT 
  COUNT(*) as total_items,
  COUNT(CASE WHEN price IS NULL THEN 1 END) as null_prices,
  COUNT(CASE WHEN price = '' THEN 1 END) as empty_prices,
  COUNT(CASE WHEN price < 0 THEN 1 END) as negative_prices,
  COUNT(CASE WHEN price >= 0 AND price IS NOT NULL THEN 1 END) as valid_prices
FROM menu_items;

-- 7. Проверяем orders на наличие NaN
SELECT 
  id, 
  order_number, 
  subtotal, 
  tax_amount, 
  total_amount
FROM orders 
WHERE subtotal IS NULL 
   OR tax_amount IS NULL 
   OR total_amount IS NULL
   OR subtotal < 0 
   OR tax_amount < 0 
   OR total_amount < 0
LIMIT 10;

-- 8. Исправляем некорректные значения в orders
UPDATE orders 
SET 
  subtotal = COALESCE(NULLIF(subtotal, ''), 0.00),
  tax_amount = COALESCE(NULLIF(tax_amount, ''), 0.00),
  total_amount = COALESCE(NULLIF(total_amount, ''), 0.00)
WHERE subtotal IS NULL 
   OR subtotal = '' 
   OR tax_amount IS NULL 
   OR tax_amount = '' 
   OR total_amount IS NULL 
   OR total_amount = '';

-- 9. Проверяем результат
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN subtotal IS NULL THEN 1 END) as null_subtotal,
  COUNT(CASE WHEN tax_amount IS NULL THEN 1 END) as null_tax,
  COUNT(CASE WHEN total_amount IS NULL THEN 1 END) as null_total
FROM orders;



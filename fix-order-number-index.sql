-- Исправление дублирования номеров заказов
-- Добавляем уникальный индекс для order_number

-- 1. Удаляем существующий индекс если он есть
DROP INDEX IF EXISTS IDX_75eba1c6b1a66b09f2a97e6927 ON orders;

-- 2. Добавляем уникальный индекс для order_number
ALTER TABLE orders ADD UNIQUE INDEX idx_order_number_unique (order_number);

-- 3. Проверяем существующие дубликаты
SELECT order_number, COUNT(*) as count
FROM orders 
GROUP BY order_number 
HAVING COUNT(*) > 1;

-- 4. Если есть дубликаты, исправляем их
-- (выполнить только если есть дубликаты)

-- Пример исправления дубликата:
-- UPDATE orders 
-- SET order_number = CONCAT(order_number, '-', id)
-- WHERE id IN (
--   SELECT id FROM (
--     SELECT id FROM orders o1
--     WHERE EXISTS (
--       SELECT 1 FROM orders o2 
--       WHERE o2.order_number = o1.order_number 
--       AND o2.id < o1.id
--     )
--   ) AS temp
-- );

-- 5. Проверяем результат
SHOW INDEX FROM orders WHERE Key_name = 'idx_order_number_unique';


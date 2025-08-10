"use client";

import { useState } from "react";

export function ProductsFilters() {
  const [open, setOpen] = useState<
    null | "categories" | "waiter" | "fiscal" | "advanced"
  >(null);

  const toggle = (key: "categories" | "waiter" | "fiscal" | "advanced") => {
    setOpen((prev) => (prev === key ? null : key));
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button type="submit" className="px-3 text-gray-500">🔍</button>
        <input
          type="search"
          className="px-3 py-2 text-sm outline-none"
          placeholder="Быстрый поиск"
        />
      </div>

      <div className="flex items-center gap-2 relative">
        {/* Категории */}
        <div className="relative">
          <button
            onClick={() => toggle("categories")}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-1">Категории</span>
            <span className="align-middle">▾</span>
          </button>
          {open === "categories" && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow p-3 z-10">
              <div className="flex items-center justify-between text-sm mb-2">
                <a href="#" className="text-blue-600">Выбрать все</a>
                <a href="#" className="text-blue-600">Очистить</a>
              </div>
              <input
                type="search"
                placeholder="Поиск..."
                className="w-full border rounded px-2 py-1 text-sm mb-2"
                defaultValue=""
              />
              <ul className="text-sm max-h-56 overflow-auto space-y-1">
                <li>Главный экран</li>
                <li>Напитки</li>
                <li>Фирменные роллы</li>
                <li>Мини роллы</li>
                <li>Жаренные роллы</li>
                <li>Запеченные роллы</li>
                <li>Новинки</li>
                <li>Фастфуд</li>
                <li>Пицца</li>
                <li>Новинки пиццы</li>
                <li>Бургер</li>
                <li>Шаурма</li>
                <li>Новинка роллы</li>
                <li>Вок</li>
                <li>Суп</li>
                <li>Салаты</li>
                <li>Десерт</li>
                <li>ДОП</li>
                <li>Сеты</li>
                <li>Горячие закуски</li>
                <li>КОФЕ</li>
                <li>Суши</li>
                <li>Путь Ниндзя</li>
              </ul>
            </div>
          )}
        </div>

        {/* Официант */}
        <div className="relative">
          <button
            onClick={() => toggle("waiter")}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-1">Официант</span>
            <span className="align-middle">▾</span>
          </button>
          {open === "waiter" && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow p-3 z-10">
              <div className="flex items-center justify-between text-sm mb-2">
                <a href="#" className="text-blue-600">Выбрать все</a>
                <a href="#" className="text-blue-600">Очистить</a>
              </div>
              <input
                type="search"
                placeholder="Поиск..."
                className="w-full border rounded px-2 py-1 text-sm mb-2"
                defaultValue=""
              />
              <ul className="text-sm space-y-1 max-h-56 overflow-auto">
                <li>Shef</li>
                <li>Замира</li>
                <li>Ситора</li>
                <li>Sushi Chef</li>
              </ul>
            </div>
          )}
        </div>

        {/* Фискализация */}
        <div className="relative">
          <button
            onClick={() => toggle("fiscal")}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-1">Фискализация</span>
            <span className="align-middle">▾</span>
          </button>
          {open === "fiscal" && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow p-3 z-10">
              <div className="flex items-center justify-between text-sm mb-2">
                <a href="#" className="text-blue-600">Выбрать все</a>
                <a href="#" className="text-blue-600">Очистить</a>
              </div>
              <input
                type="search"
                placeholder="Поиск..."
                className="w-full border rounded px-2 py-1 text-sm mb-2"
                defaultValue=""
              />
              <ul className="text-sm space-y-1 max-h-56 overflow-auto">
                <li>Нефискальные</li>
                <li>Фискальные</li>
                <li>С фискальным возвратом</li>
              </ul>
            </div>
          )}
        </div>

        {/* Фильтр */}
        <div className="relative">
          <button
            onClick={() => toggle("advanced")}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-2">+</span>
            <span>Фильтр</span>
          </button>
          {open === "advanced" && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow p-3 z-10">
              <div className="text-sm mb-2">Показать только те, в которых:</div>
              <select className="w-full border rounded px-2 py-2 text-sm bg-white">
                <option>Выберите…...</option>
                <option>Есть скидка</option>
                <option>Без скидки</option>
                <option>Прибыль отрицательная</option>
                <option>Налог 0</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



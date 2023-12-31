###### Задача:
Разработать систему кластеризации, анализа, интерактивной визуализации и контроля поездопотоков заказчика.

---
###### Описание проекта:
Система состоит из динамических фильтров, редактора и визуальных представлений (*табличного, графического и картографического*) поездопотоков и включает в себя:
- гибкий редактор маршрутов по ключевым точкам с автоматической достройкой цепочки станций по взвешенному графу, включающему в себя всю железнодорожную сеть России;
- автоматическое назначение поездов на маршрут с последующим анализом их движения;
- отображение свойств выбранных маршрута, станций и поезда;
- отображение поездов на выбранном маршруте в 3-х визуальных представлениях с показом расписания, прогноза движения, характеристик движения и прочей служебной информации;
- редактор свойств поезда, включающий в себя параметры визуализации и логики, а также корректировку прогноза движения и плана пребывания на станции назначения.

---
Также для системы были разработаны сопроводительные утилиты:
- графические и консольные приложения для ввода, генерации и конвертации данных;
- сборочная утилита: с интеграцией Git Hooks, поддержкой конфигураций окружения, автоматической версионностью и оптимизацей ассетов;
- библиотека компонентов с широкоми возможностями настройки.

---
###### Особенности проекта:
- уровни доступа пользователей;
- панель администрирования;
- учет, анализ и прогнозирование больших объемов данных;
- кроссбраузерная адаптивная верстка;
- комплексная модульная frontend логика;
- интерактивная визуализация больших объемов данных:
  * модуль валидации и динамической подгрузки данных;
  * модуль кластеризации, хэширования и подготовки примитивов;
  * табличное представление с режимом редактирования;
  * графическое представление с режимом редактирования;
  * картографическое представление с режимом редактирования.

---
Стек: PNPM, Vite, TypeScript, React, Zustand, PixiJS, Leaflet, Storybook, SASS/SCSS, PostCSS, Axios, Zod, ESLint, Prettier, Vitest, TestingLibrary, Playwright, NodeJS, ExpressJS, ClickHouse, Docker

---
В демонстрационной версии представлен наиболее интересный фрагмент системы – модуль графического представления поездопотоков, сделанный средствами React, Zustand и PixiJS.

---
**Важно**: скриншоты, демо-версия и исходники представляют из себя обезличенный вертикальный срез разработанной системы и не отражают её полного внешнего вида, функционала и структуры.

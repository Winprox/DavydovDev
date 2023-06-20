## Исходники [DavydovDev.com](https://DavydovDev.com) и [Chart](https://DavydovDev.com/chart)
* ```/app``` – портфолио [TypeScript/React/Tailwind/Vite]
* ```/chart``` – графическая визуализация больших объемов данных ([подробнее...](https://davydovdev.com/rail-dispatcher)) [TypeScript/React/Zustand/Canvas/WebGL/PixiJS/Tailwind/Vite]
* ```/components``` – библиотека компонентов [TypeScript/React/Tailwind/Storybook/Vite]

## Как запустить?
1. ```pnpm i``` – скачать зависимости
2. Запустить интересующее приложение:
     * ```pnpm dev``` – портфолио
     * ```pnpm chart``` – графическая визуализация больших объемов данных
     * ```pnpm ui``` – библиотека компонентов

## Как устроен рендеринг в [Chart](https://DavydovDev.com/chart)?
1. ```dataStore.ts``` – модуль подготовки примитивов
   1. подготавливает примитивы из сгенерированных данных
   2. помещает примитивы в сектора на основе будущего расположения в canvas
2. ```bufferStore.tsx``` – модуль буфера
   1. получает информацию о перемещениях окна
   2. запрашивает примитивы для секторов, попавших в поле видимости окна
   3. подготавливает JSX компоненты из примитивов для дальнейшей вставки в canvas
3. ```Main.tsx``` получает список JSX компонентов из буфера и помещает их в canvas

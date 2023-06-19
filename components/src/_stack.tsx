import { ReactNode } from 'react';
import { GiBearHead, GiBookshelf } from 'react-icons/gi';
import { SiAndroid, SiAndroidstudio, SiAutoprefixer, SiAxios, SiClickhouse, SiDart, SiDocker, SiEslint, SiExpress, SiFirebase, SiFlutter, SiKotlin, SiLeaflet, SiMarkdown, SiNodedotjs, SiPlaywright, SiPnpm, SiPostcss, SiPrettier, SiReact, SiReactrouter, SiReacttable, SiSass, SiStorybook, SiStripe, SiTailwindcss, SiTensorflow, SiTestinglibrary, SiTsnode, SiTypescript, SiUnity, SiVite, SiVitest } from 'react-icons/si'; // prettier-ignore
import { TbBrandCSharp } from 'react-icons/tb';
import bloc from '../assets/bloc.svg';
import cva from '../assets/cva.svg';
import pixi from '../assets/pixi.svg';
import postgresql from '../assets/postgresql.svg';
import responsive from '../assets/responsive.svg';
import zod from '../assets/zod.svg';

export type TStackItem = { icon: ReactNode; url: string };

export const Stack = {
  pnpm: {
    icon: <SiPnpm title='PNPM: Менеджер пакетов' size={18} />,
    url: 'https://github.com/pnpm/pnpm',
  },
  vite: {
    icon: <SiVite title='Vite: Сборщик проектов' size={20} />,
    url: 'https://github.com/vitejs/vite',
  },
  react: {
    icon: (
      <SiReact title='React: Библиотека для создания пользовательских интерфейсов' size={20} />
    ),
    url: 'https://github.com/facebook/react',
  },
  axios: {
    icon: <SiAxios title='Axios: HTTP клиент для браузера и NodeJS' size={20} />,
    url: 'https://github.com/axios/axios',
  },
  zod: {
    icon: (
      <img
        src={zod}
        className='h-6 object-contain'
        title='Zod: TypeScript-first валидатор с приведением типов'
      />
    ),
    url: 'https://github.com/colinhacks/zod',
  },
  typescript: {
    icon: <SiTypescript title='TypeScript: JavaScript с типизацией :)' size={20} />,
    url: 'https://github.com/microsoft/TypeScript',
  },
  tailwind: {
    icon: <SiTailwindcss title='Tailwind: Utility-frist CSS фреймворк' size={20} />,
    url: 'https://github.com/tailwindlabs/tailwindcss',
  },
  zustand: {
    icon: <GiBearHead title='Zustand: Стейт менеджер' size={20} />,
    url: 'https://github.com/pmndrs/zustand',
  },
  pixi: {
    icon: (
      <img
        src={pixi}
        className='h-4 object-contain'
        title='PixiJS: Рендер библиотека на WebGL'
      />
    ),
    url: 'https://github.com/pixijs/pixijs',
  },
  leaflet: {
    icon: <SiLeaflet title='Leaflet: Интерактивные карты' size={20} />,
    url: 'https://github.com/Leaflet/Leaflet',
  },
  reactTable: {
    icon: <SiReacttable title='TanStack Table: Манипулирование табличными данным' size={20} />,
    url: 'https://github.com/TanStack/table',
  },
  reactRouter: {
    icon: (
      <SiReactrouter title='React Router: Переключение и маршрутизация страниц' size={20} />
    ),
    url: 'https://github.com/remix-run/react-router',
  },
  scss: {
    icon: <SiSass title='SCSS: CSS препроцессор' size={20} />,
    url: 'https://github.com/sass/sass',
  },
  cva: {
    icon: (
      <img
        src={cva}
        className='h-4 object-contain'
        title='Class Variance Authority: Утилита вариаций стилизации компонентов'
      />
    ),
    url: 'https://github.com/joe-bell/cva',
  },
  postcss: {
    icon: <SiPostcss title='PostCSS: Трансформирует стили с помощью JavaScript' size={20} />,
    url: 'https://github.com/postcss/postcss',
  },
  autoprefixer: {
    icon: <SiAutoprefixer title='Autoprefixer: Автоматические вендор-префиксы' size={20} />,
    url: 'https://github.com/postcss/autoprefixer',
  },
  eslint: {
    icon: <SiEslint title='ESLint: JavaScript/TypeScript линтер' size={20} />,
    url: 'https://github.com/eslint/eslint',
  },
  prettier: {
    icon: <SiPrettier title='Prettier: Средство форматирования кода' size={20} />,
    url: 'https://github.com/prettier/prettier',
  },
  storybook: {
    icon: <SiStorybook title='Storybook: Окружение для разработки UI компонентов' size={20} />,
    url: 'https://github.com/storybookjs/storybook',
  },
  vitest: {
    icon: <SiVitest title='Vitest: Unit-тест фреймворк' size={20} />,
    url: 'https://github.com/vitest-dev/vitest',
  },
  reactTesting: {
    icon: (
      <SiTestinglibrary title='TestingLibrary: Функции тестирования компонентов' size={20} />
    ),
    url: 'https://github.com/testing-library/react-testing-library',
  },
  playwright: {
    icon: <SiPlaywright title='Playwright: Фреймворк для E2E тестирования' size={20} />,
    url: 'https://github.com/microsoft/playwright',
  },
  cSharp: {
    icon: <TbBrandCSharp title='C#: Язык программирования' size={22} />,
    url: 'https://github.com/dotnet/csharplang',
  },
  unity: {
    icon: <SiUnity title='Unity: Игровой движок' size={20} />,
    url: 'https://github.com/Unity-Technologies',
  },
  markdown: {
    icon: <SiMarkdown title='Markdown: Минималистичный язык разметки' size={20} />,
    url: 'https://en.wikipedia.org/wiki/Markdown',
  },
  docker: {
    icon: <SiDocker title='Docker: Контейнеризация и пакетирование приложений' size={20} />,
    url: 'https://github.com/docker',
  },
  node: {
    icon: (
      <SiNodedotjs title='NodeJS: JavaScript движок, исполняемый вне браузера' size={20} />
    ),
    url: 'https://github.com/nodejs/node',
  },
  tsnode: {
    icon: <SiTsnode title='TSNode: Исполняет TypeScript в Node.js' size={20} />,
    url: 'https://github.com/TypeStrong/ts-node',
  },
  express: {
    icon: <SiExpress title='ExpressJS: Минималистичный веб фреймворк' size={20} />,
    url: 'https://github.com/expressjs/express',
  },
  dart: {
    icon: <SiDart title='Dart: Язык программирования' size={18} />,
    url: 'https://github.com/dart-lang',
  },
  shelf: {
    icon: <GiBookshelf title='Shelf: Веб сервер для Dart' size={20} />,
    url: 'https://github.com/dart-lang/shelf',
  },
  flutter: {
    icon: (
      <SiFlutter
        title='Flutter: Фреймворк для создания кросплатформенных мобильных, веб и десктопных приложений'
        size={18}
      />
    ),
    url: 'https://github.com/flutter/flutter',
  },
  bloc: {
    icon: <img src={bloc} className='h-5 object-contain' title='BLoC: Стейт менеджер' />,
    url: 'https://github.com/felangel/bloc',
  },
  responsiveFramework: {
    icon: (
      <img
        src={responsive}
        className='h-5 object-contain'
        title='Responsive Framework: Фреймворк поддержки адаптивности интерфейсов'
      />
    ),
    url: 'https://github.com/Codelessly/ResponsiveFramework',
  },
  stripe: {
    icon: <SiStripe title='Stripe: Сервис онлайн платежей' size={18} />,
    url: 'https://github.com/stripe',
  },
  firebase: {
    icon: <SiFirebase title='Firebase: Backend as a Service от Google' size={18} />,
    url: 'https://github.com/firebase',
  },
  postgres: {
    icon: (
      <img
        src={postgresql}
        className='h-4 object-contain'
        title='PostgreSQL: Реляционная СУБД'
      />
    ),
    url: 'https://github.com/postgres/postgres',
  },
  clickhouse: {
    icon: <SiClickhouse title='ClickHouse: СУБД для больших данных' size={20} />,
    url: 'https://github.com/ClickHouse/ClickHouse',
  },
  tensorflow: {
    icon: <SiTensorflow title='Tensorflow: Платформа для машинного обучения' size={20} />,
    url: 'https://github.com/tensorflow/tensorflow',
  },
  kotlin: {
    icon: <SiKotlin title='Kotlin: Язык программирования' size={14} />,
    url: 'https://github.com/JetBrains/kotlin',
  },
  android: {
    icon: <SiAndroid title='Android: Операционная система на основе Linux' size={20} />,
    url: 'https://github.com/android',
  },
  androidStudio: {
    icon: <SiAndroidstudio title='Android Studio: Среда разработки под Android' size={20} />,
    url: 'https://developer.android.com/studio',
  },
};

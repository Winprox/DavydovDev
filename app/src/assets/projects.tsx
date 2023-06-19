import { Button, Stack, TCarousel, TImage, TStackItem, cm, openNewTab, } from '@local/components'; // prettier-ignore
import { ReactNode } from 'react';
import { BsGooglePlay } from 'react-icons/bs';
import { HiDocumentText } from 'react-icons/hi';
import { MdCode, MdRocketLaunch } from 'react-icons/md';
import { TiDownload } from 'react-icons/ti';
import AsuKp from '../assets/md/projects/asukp.md';
import AsuTer from '../assets/md/projects/asuter.md';
import GMed from '../assets/md/projects/gmed.md';
import HauntedManor from '../assets/md/projects/hauntedmanor.md';
import ScoreKeeper from '../assets/md/projects/scorekeeper.md';
import StickCross from '../assets/md/projects/stickcross.md';
import AsuKp0 from './pictures/asukp/0.png';
import AsuKpBanner from './pictures/asukp/banner.png';
import AsuTer0 from './pictures/asuter/0.png';
import AsuTer1 from './pictures/asuter/1.png';
import AsuTer2 from './pictures/asuter/2.png';
import AsuTer3 from './pictures/asuter/3.png';
import AsuTerBanner from './pictures/asuter/banner.png';
import GMed0 from './pictures/gmed/0.png';
import GMed1 from './pictures/gmed/1.png';
import GMed2 from './pictures/gmed/2.png';
import GMed3 from './pictures/gmed/3.png';
import GMed4 from './pictures/gmed/4.png';
import GMedBanner from './pictures/gmed/banner.png';
import HauntedManor0 from './pictures/hauntedmanor/0.jpg';
import HauntedManor1 from './pictures/hauntedmanor/1.jpg';
import HauntedManorBanner from './pictures/hauntedmanor/banner.jpg';
import ScoreKeeper0 from './pictures/scorekeeper/0.jpg';
import ScoreKeeperBanner from './pictures/scorekeeper/banner.png';
import StickCross0 from './pictures/stickcross/0.jpg';
import StickCross1 from './pictures/stickcross/1.jpg';
import StickCrossBanner from './pictures/stickcross/banner.jpg';

const chartSourcesUrl = 'https://github.com/Winprox/DavydovDev/tree/main';
const chartUrl = 'chart';
const asuterUrl = 'https://asu-ter.web.app/';
const gmedUrl = 'https://gmeddemo.web.app/book';
const stickCrossUrl = 'https://play.google.com/store/apps/details?id=redmoon.StickCross';
const scoreKeeperUrl = 'https://play.google.com/store/apps/details?id=eu.exdev.scorekeeper';
const hauntedManorPaperUrl =
  'https://drive.google.com/file/d/1fuVdi8ks3aQH5cDUWcF-BzPNter05V8M/view';
const hauntedManorUrl =
  'https://drive.google.com/drive/folders/1M6JOJQAwtlljpxdEpwJBFo09Y2oUN1xu';

type Project = {
  id: string;
  imageProps?: TImage;
  carouselProps?: TCarousel;
  title?: string;
  footer?: string;
  actions?: ReactNode;
  cardImage: string;
  images?: string[];
  cardDesc: string;
  desc?: string;
  cardStack: TStackItem[];
  stack?: TStackItem[];
};

export const projects: Project[] = [
  {
    id: 'rail-dispatcher',
    cardImage: AsuKpBanner,
    images: [AsuKp0],
    title: 'Система диспетчеризации железнодорожных перевозок',
    cardDesc: 'Кластеризация, анализ, интерактивная визуализация и контроль поездопотоков',
    footer: 'Проект ОАО "РЖД"\nРазмер команды: 5 чел',
    actions: (
      <div className='flex w-full flex-wrap justify-center gap-5 px-4'>
        <Button
          href={chartUrl}
          className='font-xl gap-2 px-4 py-2'
          onClick={() => openNewTab(chartUrl)}
        >
          <MdRocketLaunch size={20} />
          Демонстрационная версия
        </Button>
        <Button
          href={chartSourcesUrl}
          className='font-xl gap-2 px-4 py-2'
          onClick={() => openNewTab(chartSourcesUrl)}
        >
          <MdCode size={20} />
          Исходники демо-версии
        </Button>
      </div>
    ),
    desc: AsuKp,
    cardStack: [
      Stack.vite,
      Stack.typescript,
      Stack.react,
      Stack.pixi,
      Stack.leaflet,
      Stack.storybook,
      Stack.scss,
    ],
    stack: [
      Stack.pnpm,
      Stack.vite,
      Stack.typescript,
      Stack.react,
      Stack.reactRouter,
      Stack.zustand,
      Stack.pixi,
      Stack.leaflet,
      Stack.storybook,
      Stack.cva,
      Stack.scss,
      Stack.postcss,
      Stack.autoprefixer,
      Stack.reactTable,
      Stack.axios,
      Stack.zod,
      Stack.eslint,
      Stack.prettier,
      Stack.vitest,
      Stack.reactTesting,
      Stack.playwright,
      Stack.node,
      Stack.express,
      Stack.clickhouse,
      Stack.docker,
    ],
  },
  {
    id: 'energy-cost-management',
    cardImage: AsuTerBanner,
    images: [AsuTer0, AsuTer1, AsuTer2, AsuTer3],
    imageProps: { imageClassName: cm('object-contain h-[18rem] sm:h-auto sm:max-h-[35rem]') },
    carouselProps: { wrapAround: true, slidesToShow: 2 },
    title: 'Система управления топливно-энергетическими затратами на жд сети',
    cardDesc:
      'Конфигурация, формирование и визуализация многопараметровых отчетов, оптимизированные под мобильные устройства',
    footer: 'Проект ОАО "РЖД"\nРазмер команды: 8 чел',
    actions: (
      <Button
        href={asuterUrl}
        className='font-xl gap-2 px-4 py-2'
        onClick={() => openNewTab(asuterUrl)}
      >
        <MdRocketLaunch size={20} />
        Демонстрационная версия
      </Button>
    ),
    desc: AsuTer,
    cardStack: [
      Stack.dart,
      Stack.flutter,
      Stack.bloc,
      Stack.responsiveFramework,
      Stack.node,
      Stack.express,
      Stack.postgres,
    ],
    stack: [
      Stack.dart,
      Stack.flutter,
      Stack.bloc,
      Stack.responsiveFramework,
      Stack.node,
      Stack.express,
      Stack.postgres,
    ],
  },
  {
    id: 'medical-scheduling',
    cardImage: GMedBanner,
    images: [GMed0, GMed1, GMed2, GMed3, GMed4],
    imageProps: { imageClassName: cm('object-contain h-[18rem] sm:h-auto sm:max-h-[35rem]') },
    carouselProps: { wrapAround: true, slidesToShow: 2 },
    title: 'Сервис онлайн-записи для медицинского центра',
    cardDesc:
      'Автоматизация расписаний и времен приема сотрудников, список услуг центра, личный кабинет пациента, бронирование и онлайн оплата записей',
    footer: 'Проект "Sprout Systems, Ltd."\nРазмер команды: 4 чел',
    actions: (
      <Button
        href={gmedUrl}
        className='font-xl gap-2 px-4 py-2'
        onClick={() => openNewTab(gmedUrl)}
      >
        <MdRocketLaunch size={20} />
        Демонстрационная версия
      </Button>
    ),
    desc: GMed,
    cardStack: [
      Stack.dart,
      Stack.flutter,
      Stack.bloc,
      Stack.responsiveFramework,
      Stack.shelf,
      Stack.firebase,
      Stack.stripe,
    ],
    stack: [
      Stack.dart,
      Stack.flutter,
      Stack.bloc,
      Stack.responsiveFramework,
      Stack.shelf,
      Stack.firebase,
      Stack.stripe,
    ],
  },
  {
    id: 'ai-game',
    cardImage: HauntedManorBanner,
    images: [HauntedManor0, HauntedManor1],
    title: 'Видеоигра с искусственным интеллектом на основе машинного обучения',
    cardDesc:
      'Комбинация нейросетей и классических подходов к программированию игрового искусственного интеллекта',
    footer: 'Магистерская диссертация в НИУ "ВШЭ"',
    actions: (
      <div className='flex w-full flex-wrap justify-center gap-5 px-4'>
        <Button
          href={hauntedManorPaperUrl}
          className='font-xl gap-2 px-4 py-2'
          onClick={() => openNewTab(hauntedManorPaperUrl)}
        >
          <HiDocumentText size={20} />
          Посмотреть диссертацию
        </Button>
        <Button
          href={hauntedManorUrl}
          className='font-xl gap-2 px-4 py-2'
          onClick={() => openNewTab(hauntedManorUrl)}
        >
          <TiDownload size={20} />
          Скачать игру (Windows/Mac/Linux)
        </Button>
      </div>
    ),
    desc: HauntedManor,
    cardStack: [Stack.cSharp, Stack.unity, Stack.tensorflow],
    stack: [Stack.cSharp, Stack.unity, Stack.tensorflow],
  },
  {
    id: 'platformer-game',
    cardImage: StickCrossBanner,
    images: [StickCross0, StickCross1],
    imageProps: { imageClassName: cm('object-contain h-[18rem] sm:h-auto sm:max-h-[35rem]') },
    carouselProps: { wrapAround: false, slidesToShow: 2 },
    title: 'Мобильная видеоигра платформер',
    cardDesc:
      'Казуальный бесконечный платформер с элементарным управлением и затягивающим игровым процессом',
    footer: 'Личный проект\nРазмер команды: 2 чел',
    desc: StickCross,
    actions: (
      <Button
        href={stickCrossUrl}
        className='font-xl gap-2 px-4 py-2'
        onClick={() => openNewTab(stickCrossUrl)}
      >
        <BsGooglePlay size={18} />
        Google Play
      </Button>
    ),
    cardStack: [Stack.cSharp, Stack.unity],
    stack: [Stack.cSharp, Stack.unity],
  },
  {
    id: 'counter-app',
    cardImage: ScoreKeeperBanner,
    images: [ScoreKeeper0],
    imageProps: { imageClassName: cm('object-contain h-[18rem] sm:h-auto sm:max-h-[35rem]') },
    carouselProps: { wrapAround: false },
    title: 'Счетчик очков для настольной игры "Манчкин"',
    cardDesc: 'Отслеживание характеристик персонажей игры',
    footer: 'Личный проект\nРазмер команды: 1 чел',
    actions: (
      <Button
        href={scoreKeeperUrl}
        className='font-xl gap-2 px-4 py-2'
        onClick={() => openNewTab(scoreKeeperUrl)}
      >
        <BsGooglePlay size={18} />
        Google Play
      </Button>
    ),
    desc: ScoreKeeper,
    cardStack: [Stack.kotlin, Stack.android, Stack.androidStudio],
    stack: [Stack.kotlin, Stack.android, Stack.androidStudio],
  },
];

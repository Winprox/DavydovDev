import { Point } from 'pixi.js';
import { TObject, TObjectDataPrimitive, TObjectPoint, TObjectPrimitive, TObjectTop, TObjectTopPrimitive, TObjectsConfig, TTopObjectsConfig, TType } from './@types'; // prettier-ignore
import { MS_IN_MIN, getObjects, getTopObjects, getTypes } from './dataService';
import { TStore, create } from './zustand';

const dateDay = (date: Date) =>
  new Date(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      date.getTimezoneOffset() * MS_IN_MIN
  );

const MAX_AVAILABLE_KM = 1e5;
export const KM_GRID_STEP = 100;
export const TIME_GRID_STEP = 60 * 24;

const DEFAULT_TYPE_COUNT = 3;
const DEFAULT_OBJECTS_CONFIG: TObjectsConfig = {
  objectsCount: [10, 75],
  pointsCount: [50, 100],
  pointKm: [10, 20],
  pointTime: [10, 60],
  stayingChance: 50,
  stayingTimeDivider: 2,
  startTime: [0, 0],
  notArrivedChance: 10,
  notArrivedKm: [1, 500],
};
const DEFAULT_TOP_OBJECTS_CONFIG: TTopObjectsConfig = {
  opersCount: [2, 10],
  opersLength: [1, 100],
};

type TState = {
  config: {
    autoStartTime: boolean;
    toggleAutoStartTime: () => void;
    object?: string;
    setObject: (id?: string) => void;
    typesCount: number;
    setTypesCount: (count: number) => void;
    objects: TObjectsConfig;
    setObjects: (config: Partial<TObjectsConfig>) => void;
    topObjects: TTopObjectsConfig;
    setTopObjects: (config: Partial<TTopObjectsConfig>) => void;
  };
  types: {
    loading: boolean;
    error?: string;
    list: TType[];
    fetch: () => void;
  };
  objects: {
    loading: boolean;
    error?: string;
    map: Map<string, TObject>;
    fetch: () => void;
    timeMap: Map<string, (TObjectPrimitive | TObjectDataPrimitive)[]>[];
    prepareForChart: () => void;
  };
  topObjects: {
    loading: boolean;
    error?: string;
    map: Map<string, TObjectTop>;
    fetch: () => void;
    timeMap: Map<string, TObjectTopPrimitive[]>[];
    prepareForChart: () => void;
  };
  dates: {
    start: Date;
    from?: number;
    to?: number;
    setBounds: (from?: number, to?: number) => void;
    toConfig: (fromAutoStartTimeChange?: boolean) => void;
  };
};

export const dataStore: TStore<TState> = create<TState>(
  (set, get) => ({
    config: {
      autoStartTime: true,
      toggleAutoStartTime: () =>
        set((s) => ({ config: { ...s.config, autoStartTime: !s.config.autoStartTime } })),
      object: undefined,
      setObject: (object) => set((s) => ({ config: { ...s.config, object } })),
      typesCount: DEFAULT_TYPE_COUNT,
      setTypesCount: (typesCount) => set((s) => ({ config: { ...s.config, typesCount } })),
      objects: DEFAULT_OBJECTS_CONFIG,
      setObjects: (objects) =>
        set((s) => ({
          config: { ...s.config, objects: { ...s.config.objects, ...objects } },
        })),
      topObjects: DEFAULT_TOP_OBJECTS_CONFIG,
      setTopObjects: (topObjects) =>
        set((s) => ({
          config: { ...s.config, topObjects: { ...s.config.topObjects, ...topObjects } },
        })),
    },
    types: {
      loading: false,
      error: undefined,
      list: [],
      fetch: () => {
        const config = get().config.typesCount;
        set((s) => ({ types: { ...s.types, loading: true, error: undefined } }));
        getTypes(config)
          .then((list) => set((s) => ({ types: { ...s.types, list } })))
          .catch((error) => set((s) => ({ types: { ...s.types, list: [], error } })))
          .finally(() => set((s) => ({ types: { ...s.types, loading: false } })));
      },
    },
    objects: {
      loading: false,
      error: undefined,
      map: new Map(),
      fetch: () => {
        const config = get().config.objects;
        set((s) => ({ objects: { ...s.objects, loading: true, error: undefined } }));
        getObjects(get().types.list, config)
          .then((map) => set((s) => ({ objects: { ...s.objects, map } })))
          .catch((error) => set((s) => ({ objects: { ...s.objects, map: new Map(), error } })))
          .finally(() => set((s) => ({ objects: { ...s.objects, loading: false } })));
      },
      timeMap: [],
      prepareForChart: () => {
        const types = get().types.list;

        const timeMap = Array.from(
          { length: MAX_AVAILABLE_KM / KM_GRID_STEP },
          () => new Map<string, (TObjectPrimitive | TObjectDataPrimitive)[]>()
        );

        //? Лейблы и линии соединения
        const setData = (id: string, color: number, p: TObjectPoint, title?: string) => {
          const point = new Point(p.time, p.km);
          const obj: TObjectDataPrimitive = { id, color, point, title };

          const kKey = Math.ceil(p.km / KM_GRID_STEP);
          const tKey = Math.floor(p.time / TIME_GRID_STEP) * TIME_GRID_STEP;
          const key = `${tKey},${tKey + TIME_GRID_STEP}`;
          timeMap[kKey].set(key, [...(timeMap[kKey].get(key) ?? []), obj]);
        };

        //? Линии
        const setLine = (id: string, color: number, p1: TObjectPoint, p2: TObjectPoint) => {
          const from = new Point(p1.time, p1.km);
          const to = new Point(p2.time, p2.km);
          const obj: TObjectPrimitive = { id, color, from, to };

          const kKey = Math.ceil(p1.km / KM_GRID_STEP);
          const tKey = Math.floor(p1.time / TIME_GRID_STEP) * TIME_GRID_STEP;
          const key = `${tKey},${tKey + TIME_GRID_STEP}`;
          timeMap[kKey].set(key, [...(timeMap[kKey].get(key) ?? []), obj]);
        };

        for (const { id, typeId, points } of [...get().objects.map.values()]) {
          const type = types.find((t) => t.id === typeId);
          if (!type) continue;

          const firstPoint = points.at(0);
          const lastPoint = points.at(-1);
          const color = type.color;

          if (lastPoint) setData(id, color, lastPoint, id); //? Лейбл
          if (firstPoint && firstPoint.km === 0) setData(id, color, firstPoint); //? Линия соединения

          for (let i = 0; i < points.length - 1; i++)
            setLine(id, color, points[i], points[i + 1]); //? Линии
        }

        set((s) => ({ objects: { ...s.objects, timeMap } }));
      },
    },
    topObjects: {
      loading: false,
      error: undefined,
      map: new Map(),
      fetch: () => {
        const config = get().config.topObjects;
        const date = get().dates.start;
        set((s) => ({ topObjects: { ...s.topObjects, loading: true, error: undefined } }));
        getTopObjects(date, [...get().objects.map.values()], config)
          .then((map) => set((s) => ({ topObjects: { ...s.topObjects, map } })))
          .catch((error) =>
            set((s) => ({ topObjects: { ...s.topObjects, map: new Map(), error } }))
          )
          .finally(() => set((s) => ({ topObjects: { ...s.topObjects, loading: false } })));
      },
      timeMap: [],
      prepareForChart: () => {
        const types = get().types.list;
        const typesIds = types.map((d) => d.id);
        const date = get().dates.start;

        const timeMap = Array.from(
          { length: types.length },
          () => new Map<string, TObjectTopPrimitive[]>()
        );

        [...get().topObjects.map.values()].forEach(({ id, typeId, opers, arrival }) => {
          const typeIndex = typesIds.indexOf(typeId);
          const color = types[typeIndex].color;
          const opersLength = opers.map((o) => o.length).reduce((a, b) => a + b, 0);
          const timeFrom = (arrival.getTime() - date.getTime()) / MS_IN_MIN;
          const timeTo = timeFrom + opersLength;
          const obj: TObjectTopPrimitive = { id, color, typeIndex, timeFrom, timeTo, opers };

          const tFrom = Math.floor(timeFrom / TIME_GRID_STEP) * TIME_GRID_STEP;
          const key = `${tFrom},${tFrom + TIME_GRID_STEP}`;
          timeMap[typeIndex].set(key, [...(timeMap[typeIndex].get(key) ?? []), obj]);
        });

        set((s) => ({ topObjects: { ...s.topObjects, timeMap } }));
      },
    },
    dates: {
      start: dateDay(new Date()),
      from: undefined,
      to: undefined,
      setBounds: (from, to) => set((s) => ({ dates: { ...s.dates, from, to } })),
      toConfig: (fromAutoStartTimeChange) => {
        const { from, to } = get().dates;
        const { autoStartTime, setObjects } = get().config;
        if ((!autoStartTime && !fromAutoStartTimeChange) || !from || !to) return;
        setObjects({ startTime: [from, to] });
      },
    },
  }),
  //? Рассчитывает относительное время прибытия
  [(s) => s.dates.from, () => dataStore.getState().dates.toConfig()],
  [(s) => s.config.autoStartTime, () => dataStore.getState().dates.toConfig(true)],
  //? Сбрасывает выбранный объект при загрузке topObjects
  [(s) => s.topObjects.loading, (v) => !v && dataStore.getState().config.setObject()],
  //? Запрашивает objects при загрузке types
  [(s) => s.types.loading, (v) => !v && dataStore.getState().objects.fetch()],
  //? Запрашивает topObjects при загрузке objects
  [(s) => s.objects.loading, (v) => !v && dataStore.getState().topObjects.fetch()],
  //? Подготавливает примитивы
  [(s) => s.objects.map, () => dataStore.getState().objects.prepareForChart()],
  [(s) => s.topObjects.map, () => dataStore.getState().topObjects.prepareForChart()]
);

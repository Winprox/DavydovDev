import { Point } from 'pixi.js';
import { Fragment } from 'react';
import { Y_AXIS_WIDTH } from '../app/Main';
import { AxisEntry, BGText, GridLine, Line, Operations, TViewportBounds } from '../components'; // prettier-ignore
import { TObjectDataPrimitive, TObjectPrimitive, TObjectTopPrimitive, TType, } from './@types'; // prettier-ignore
import { KM_GRID_STEP, TIME_GRID_STEP, dataStore } from './dataStore';
import { TStore, create, proxy } from './zustand';

type Grid = { kms: number[][]; kmsIndexes: number[]; times: number[][]; timesKeys: string[] };
const GRID_DEFAULT: Grid = { kms: [], kmsIndexes: [], times: [], timesKeys: [] };
type GridTop = { types: number[] };
const GRID_TOP_DEFAULT: GridTop = { types: [] };

export const MLN = 1000000;
const MS_IN_MIN = 60000;
const MIN_IN_DAY = 60 * 24;
const MS_IN_DAY = MS_IN_MIN * MIN_IN_DAY;
const SELECTED_COLOR = 0xffffff;

const X_SCALE_STEP = 0.05;
const X_SCALE_STEPS = [0.1, 0.15, 0.3, 0.6, 0.9, 1.5];
const X_SCALE_MIN = X_SCALE_STEPS.at(0)! / 1.75;
const X_SCALE_MAX = X_SCALE_STEPS.at(-1)! * 1.75;

const Y_SCALE_STEP = 0.05;
const Y_SCALE_STEPS = [0.2, 0.4, 0.8];
const Y_SCALE_MIN = Y_SCALE_STEPS.at(0)! / 1.75;
const Y_SCALE_MAX = Y_SCALE_STEPS.at(-1)! * 1.75;

const Y_TOP_OFFSETS = [0, 0.05, 0.1, -0.05 - 0.1];
const Y_TOP_SCALE_STEP = 25;
const Y_TOP_SCALE_MIN = 50;
const Y_TOP_SCALE_MAX = 500;

const STATE_DEFAULT = {
  linesMap: new Map(),
  linesBuffer: [],
  linesTopMap: new Map(),
  linesTopBuffer: [],
  xAxisMap: new Map(),
  xAxisBuffer: [],
  xAxisLinesMap: new Map(),
  xAxisLinesBuffer: [],
  yAxisMap: new Map(),
  yAxisBuffer: [],
  yAxisLinesMap: new Map(),
  yAxisLinesBuffer: [],
  yAxisTopMap: new Map(),
  yAxisTopBuffer: [],
  yAxisTopLinesMap: new Map(),
  yAxisTopLinesBuffer: [],
  gridCurrent: GRID_DEFAULT,
  gridPrev: GRID_DEFAULT,
  gridCurrentTop: GRID_TOP_DEFAULT,
  gridPrevTop: GRID_TOP_DEFAULT,
  xScale: X_SCALE_STEPS[3],
  yScale: Y_SCALE_STEPS[2],
  yScaleTop: Y_TOP_SCALE_MIN + Y_TOP_SCALE_STEP,
};

let clearOffscreenTimeoutId: NodeJS.Timeout | undefined = undefined;
let gridFromScaleTimeoutId: NodeJS.Timeout | undefined = undefined;

type TState = {
  linesMap: Map<string, JSX.Element[]>;
  linesBuffer: JSX.Element[];
  linesTopMap: Map<string, JSX.Element[]>;
  linesTopBuffer: JSX.Element[];
  xAxisMap: Map<string, JSX.Element[]>;
  xAxisBuffer: JSX.Element[];
  xAxisLinesMap: Map<string, JSX.Element[]>;
  xAxisLinesBuffer: JSX.Element[];
  yAxisMap: Map<string, JSX.Element[]>;
  yAxisBuffer: JSX.Element[];
  yAxisLinesMap: Map<string, JSX.Element[]>;
  yAxisLinesBuffer: JSX.Element[];
  yAxisTopMap: Map<string, JSX.Element>;
  yAxisTopBuffer: JSX.Element[];
  yAxisTopLinesMap: Map<string, JSX.Element>;
  yAxisTopLinesBuffer: JSX.Element[];
  linesRender: (grid?: Grid) => void;
  linesRenderTop: (grid?: Grid) => void;
  axesRender: (grid?: Grid) => void;
  axesRenderTop: (gridTop?: GridTop) => void;
  render: (grid?: Grid) => void;
  reRenderTop: () => void;
  clearOffscreen: () => void;
  gridCurrent: Grid;
  gridPrev: Grid;
  gridGenerate: (bounds: TViewportBounds) => void;
  gridCurrentTop: GridTop;
  gridPrevTop: GridTop;
  gridGenerateTop: (bounds: TViewportBounds) => void;
  fromScale: boolean;
  scaleIn: boolean;
  xScale: number;
  setXScale: (increase?: boolean) => void;
  yScale: number;
  setYScale: (increase?: boolean) => void;
  yScaleTop: number;
  setYScaleTop: (increase?: boolean) => void;
  reset: () => void;
  proxy: {
    object?: string;
    setObject: (id?: string) => void;
    startDate: Date;
    types: TType[];
    objectsTimeMap: Map<string, (TObjectPrimitive | TObjectDataPrimitive)[]>[];
    topObjectsTimeMap: Map<string, TObjectTopPrimitive[]>[];
  };
};

export const bufferStore: TStore<TState> = create<TState>((set, get) => ({
  ...STATE_DEFAULT,
  linesRender: (gridAdded) => {
    const map = get().linesMap;
    if (!gridAdded) map.clear();

    const gridCurrent = get().gridCurrent;
    const grid = gridAdded ?? gridCurrent;
    const xScale = get().xScale;
    const yScale = get().yScale;
    const { objectsTimeMap, object, setObject } = get().proxy;

    if (grid.timesKeys.length)
      for (const index of gridCurrent.kmsIndexes)
        if (objectsTimeMap[index] !== undefined)
          for (const key of grid.timesKeys) {
            const mapKey = `${index},${key}`;
            if (!map.has(mapKey))
              objectsTimeMap[index]
                .get(key)
                ?.forEach((data) =>
                  _generateLine(data, map, mapKey, xScale, yScale, setObject, object)
                );
          }

    if (grid.kmsIndexes.length)
      for (const key of gridCurrent.timesKeys)
        for (const index of grid.kmsIndexes)
          if (objectsTimeMap[index] !== undefined) {
            const mapKey = `${index},${key}`;
            if (!map.has(mapKey))
              objectsTimeMap[index]
                .get(key)
                ?.forEach((data) =>
                  _generateLine(data, map, mapKey, xScale, yScale, setObject, object)
                );
          }

    set({ linesBuffer: [...map.values()].flat() });
  },
  linesRenderTop: (gridAdded) => {
    const map = get().linesTopMap;
    if (!gridAdded) map.clear();

    const grid = gridAdded ?? get().gridCurrent;
    const gridTop = get().gridCurrentTop;
    const xScale = get().xScale;
    const yScaleTop = get().yScaleTop;
    const { topObjectsTimeMap, startDate, object, setObject } = get().proxy;

    for (const type of gridTop.types)
      if (topObjectsTimeMap[type] !== undefined)
        for (const key of grid.timesKeys) {
          const mapKey = `${type},${key}`;
          if (!map.has(mapKey))
            topObjectsTimeMap[type]
              .get(key)
              ?.forEach((data, i) =>
                _generateLineTop(
                  data,
                  map,
                  mapKey,
                  xScale,
                  yScaleTop,
                  Y_TOP_OFFSETS[i % Y_TOP_OFFSETS.length],
                  startDate,
                  setObject,
                  object
                )
              );
        }

    set({ linesTopBuffer: [...map.values()].flat() });
  },
  axesRender: (gridAdded) => {
    const xAxisMap = get().xAxisMap;
    const xAxisLinesMap = get().xAxisLinesMap;
    const yAxisMap = get().yAxisMap;
    const yAxisLinesMap = get().yAxisLinesMap;

    if (!gridAdded) {
      xAxisMap.clear();
      xAxisLinesMap.clear();
      yAxisMap.clear();
      yAxisLinesMap.clear();
    }

    const grid = gridAdded ?? get().gridCurrent;
    const xScale = get().xScale;
    const yScale = get().yScale;
    const startDate = get().proxy.startDate;

    let dayDivider;
    if (xScale >= X_SCALE_STEPS[5]) dayDivider = 48;
    else if (xScale >= X_SCALE_STEPS[4]) dayDivider = 24;
    else if (xScale >= X_SCALE_STEPS[3]) dayDivider = 12;
    else if (xScale >= X_SCALE_STEPS[2]) dayDivider = 8;
    else if (xScale >= X_SCALE_STEPS[1]) dayDivider = 4;
    else if (xScale >= X_SCALE_STEPS[0]) dayDivider = 2;
    else dayDivider = 1;
    const timeScale = MIN_IN_DAY / dayDivider;

    for (const time of grid.times) {
      const mapKey = `${time.join(',')}`;
      if (xAxisMap.has(mapKey)) continue;

      const xAxisComponents: JSX.Element[] = [];
      const xAxisLinesComponents: JSX.Element[] = [];

      for (let i = time[0]; i < time[1]; i += timeScale) {
        const key = `${mapKey} ${i}`;
        const deltaDate = new Date(startDate.getTime() + MS_IN_MIN * i);

        xAxisComponents.push(
          <Fragment key={key}>
            {deltaDate.getTime() % (MS_IN_DAY / (xScale >= X_SCALE_STEPS[4] ? 2 : 1)) === 0 ? (
              <AxisEntry
                vertical
                pos={i}
                crossPos={5}
                scale={xScale}
                text={dateToDDMMYYYY(deltaDate, '.', true)}
                textStyle={{ fontSize: 18 }}
                padding={0}
              />
            ) : (
              deltaDate.getTime() % timeScale === 0 && (
                <AxisEntry
                  vertical
                  pos={i}
                  crossPos={8}
                  scale={xScale}
                  text={dateToHHMM(deltaDate)}
                  textStyle={{ fontSize: 12 }}
                  padding={0}
                />
              )
            )}
          </Fragment>
        );

        xAxisLinesComponents.push(
          <GridLine vertical key={key} pos={i} scale={xScale} from={-MLN} to={MLN} />
        );
      }

      xAxisMap.set(mapKey, xAxisComponents);
      xAxisLinesMap.set(mapKey, xAxisLinesComponents);
    }

    let scale;
    if (yScale >= Y_SCALE_STEPS[2]) scale = 25;
    else if (yScale >= Y_SCALE_STEPS[1]) scale = 50;
    else if (yScale >= Y_SCALE_STEPS[0]) scale = 100;
    else scale = 250;

    for (const km of grid.kms) {
      const mapKey = Math.floor(km[0] / KM_GRID_STEP).toString();
      if (yAxisMap.has(mapKey)) continue;

      const yAxisComponents: JSX.Element[] = [];
      const yAxisLinesComponents: JSX.Element[] = [];

      for (let i = km[0]; i < km[1]; i++)
        if (i >= 0 && i % scale === 0) {
          yAxisComponents.push(
            <AxisEntry
              key={i}
              pos={i}
              scale={yScale}
              to={Y_AXIS_WIDTH}
              crossPos={4}
              text={i.toString()}
              textStyle={{ fontSize: 14 }}
              padding={4}
              zIndex={i}
            />
          );

          yAxisLinesComponents.push(
            <GridLine key={i} pos={i} scale={yScale} from={-MLN} to={MLN} />
          );
        }

      yAxisMap.set(mapKey, yAxisComponents);
      yAxisLinesMap.set(mapKey, yAxisLinesComponents);
    }

    setTimeout(() => {
      set({
        xAxisBuffer: [...xAxisMap.values()].flat(),
        xAxisLinesBuffer: [...xAxisLinesMap.values()].flat(),
        yAxisBuffer: [...yAxisMap.values()].flat(),
        yAxisLinesBuffer: [...yAxisLinesMap.values()].flat(),
      });
    }, 0);
  },
  axesRenderTop(gridAddedTop) {
    const yAxisTopMap = get().yAxisTopMap;
    const yAxisTopLinesMap = get().yAxisTopLinesMap;

    if (!gridAddedTop) {
      yAxisTopMap.clear();
      yAxisTopLinesMap.clear();
    }

    const grid = gridAddedTop ?? get().gridCurrentTop;
    const yScaleTop = get().yScaleTop;
    const { types } = get().proxy;

    for (const typeIndex of grid.types) {
      const mapKey = typeIndex.toString();
      if (yAxisTopMap.has(mapKey)) continue;

      const type = types.at(typeIndex);
      if (type) {
        yAxisTopMap.set(
          mapKey,
          <AxisEntry
            key={`${typeIndex}`}
            pos={typeIndex}
            scale={yScaleTop}
            to={Y_AXIS_WIDTH}
            crossPos={4}
            textWidthPercent={0.9}
            color={type.color}
            text={type.title}
            textStyle={{ fontSize: 14 }}
            radius={4}
            padding={4}
          />
        );

        yAxisTopLinesMap.set(
          mapKey,
          <Fragment key={typeIndex}>
            <GridLine pos={typeIndex - 0.2} scale={yScaleTop} from={-MLN} to={MLN} width={2} />
            <GridLine pos={typeIndex + 0.2} scale={yScaleTop} from={-MLN} to={MLN} width={2} />
          </Fragment>
        );
      }
    }

    setTimeout(() => {
      set({
        yAxisTopBuffer: [...yAxisTopMap.values()],
        yAxisTopLinesBuffer: [...yAxisTopLinesMap.values()],
      });
    }, 0);
  },
  render: (grid) => {
    get().axesRender(grid);
    get().linesRender(grid);
  },
  reRenderTop: () => {
    get().axesRenderTop();
    get().linesRenderTop();
  },
  clearOffscreen: () => {
    const gridCurrent = get().gridCurrent;
    const gridCurrentTop = get().gridCurrentTop;
    const linesMap = get().linesMap;
    const linesTopMap = get().linesTopMap;
    const xAxisMap = get().xAxisMap;
    const xAxisLinesMap = get().xAxisLinesMap;
    const yAxisMap = get().yAxisMap;
    const yAxisLinesMap = get().yAxisLinesMap;
    const yAxisTopMap = get().yAxisTopMap;
    const yAxisTopLinesMap = get().yAxisTopLinesMap;

    const chunks = [];
    const chunksTop = [];

    for (const timeKey of gridCurrent.timesKeys) {
      for (const kmIndex of gridCurrent.kmsIndexes) chunks.push(`${kmIndex},${timeKey}`);
      chunksTop.push(timeKey);
    }

    for (const k of linesMap.keys()) if (!chunks.includes(k)) linesMap.delete(k);
    for (const k of linesTopMap.keys()) if (!chunksTop.includes(k)) linesTopMap.delete(k);

    for (const timeKey of xAxisMap.keys())
      if (!gridCurrent.timesKeys.includes(timeKey)) {
        xAxisMap.delete(timeKey);
        xAxisLinesMap.delete(timeKey);
      }

    for (const kmKey of yAxisMap.keys())
      if (!gridCurrent.kmsIndexes.includes(+kmKey)) {
        yAxisMap.delete(kmKey);
        yAxisLinesMap.delete(kmKey);
      }

    for (const typeKey of yAxisTopMap.keys())
      if (!gridCurrentTop.types.includes(+typeKey)) {
        yAxisTopMap.delete(typeKey);
        yAxisTopLinesMap.delete(typeKey);
      }
  },
  gridGenerate: (bounds) => {
    const fromScale = get().fromScale;

    //? Не пересчитывать gridCurrent
    if (fromScale && !get().scaleIn) {
      clearTimeout(gridFromScaleTimeoutId);
      gridFromScaleTimeoutId = setTimeout(() => {
        set({ fromScale: false });
        get().gridGenerate(bounds);
      }, 250);
      return;
    }

    const kms: number[][] = [];
    const kmFrom = Math.max(Math.floor(bounds.tl.y / KM_GRID_STEP) * KM_GRID_STEP, 0);
    const kmTo = Math.ceil(bounds.br.y / KM_GRID_STEP) * KM_GRID_STEP + KM_GRID_STEP;
    for (let km = kmFrom; km < kmTo; km += KM_GRID_STEP) kms.push([km, km + KM_GRID_STEP]);
    const kmsIndexes = kms.map((k) => Math.floor(k[0] / KM_GRID_STEP));

    const times: number[][] = [];
    const timeFrom = Math.floor(bounds.tl.x / TIME_GRID_STEP) * TIME_GRID_STEP;
    const timeTo = Math.ceil(bounds.br.x / TIME_GRID_STEP) * TIME_GRID_STEP;
    for (let time = timeFrom; time < timeTo; time += TIME_GRID_STEP)
      times.push([time, time + TIME_GRID_STEP]);
    const timesKeys = times.map((t) => t.join(','));

    const gridCurrent = { kms, kmsIndexes, times, timesKeys };
    set((s) => ({ gridCurrent, gridPrev: s.gridCurrent }));

    //? Пересчитать gridCurrent, но не считать gridAdded
    if (fromScale) {
      clearTimeout(gridFromScaleTimeoutId);
      gridFromScaleTimeoutId = setTimeout(() => {
        set({ fromScale: false });
        get().gridGenerate(bounds);
      }, 250);
      return;
    }

    const gridPrev = get().gridPrev;

    const addedK: number[][] = [];
    for (const k of gridCurrent.kms)
      if (!gridPrev.kms.find((pk) => pk[0] === k[0] && pk[1] === k[1])) addedK.push(k);
    const addedKI = addedK.map((k) => Math.floor(k[0] / KM_GRID_STEP));

    const addedT: number[][] = [];
    for (const t of gridCurrent.times)
      if (!gridPrev.times.find((pt) => pt[0] === t[0] && pt[1] === t[1])) addedT.push(t);
    const addedTK = addedT.map((t) => t.join(','));

    //? Отрендерить верхние линии если изменилось время
    if (addedTK.length) get().linesRenderTop(gridCurrent);

    if (addedKI.length || addedTK.length) {
      get().render({ kms: addedK, kmsIndexes: addedKI, times: addedT, timesKeys: addedTK });
      clearTimeout(clearOffscreenTimeoutId);
      clearOffscreenTimeoutId = setTimeout(() => get().clearOffscreen(), 750);
    }
  },
  gridGenerateTop: (bounds) => {
    const allTypes = get().proxy.types;

    const types: number[] = [];
    const typeFrom = Math.max(bounds.tl.y + 1, 0);
    const typeTo = Math.min(bounds.br.y, allTypes.length);
    for (let type = typeFrom; type < typeTo; type++) types.push(type);

    const gridCurrentTop = { types };
    set((s) => ({ gridCurrentTop, gridPrevTop: s.gridCurrentTop }));

    const gridPrevTop = get().gridPrevTop;

    const addedTypes: number[] = [];
    for (const s of gridCurrentTop.types)
      if (gridPrevTop.types.find((ps) => ps === s) === undefined) addedTypes.push(s);

    get().linesRenderTop();

    //? Отрендерить types если изменился их список
    if (addedTypes.length) get().axesRenderTop({ types: addedTypes });

    clearTimeout(clearOffscreenTimeoutId);
    clearOffscreenTimeoutId = setTimeout(() => get().clearOffscreen(), 750);
  },
  fromScale: false,
  scaleIn: false,
  setXScale: (increase) => {
    const xScalePrev = get().xScale;
    const xScale = roundTo(
      increase
        ? Math.min(xScalePrev + X_SCALE_STEP, X_SCALE_MAX)
        : Math.max(xScalePrev - X_SCALE_STEP, X_SCALE_MIN),
      100
    );
    if (xScalePrev !== xScale) {
      set({ xScale, fromScale: true, scaleIn: increase });
      get().render();
      get().linesRenderTop();
    }
  },
  setYScale: (increase) => {
    const yScalePrev = get().yScale;
    const yScale = roundTo(
      increase
        ? Math.min(yScalePrev + Y_SCALE_STEP, Y_SCALE_MAX)
        : Math.max(yScalePrev - Y_SCALE_STEP, Y_SCALE_MIN),
      100
    );
    if (yScale !== yScalePrev) {
      set({ yScale, fromScale: true, scaleIn: increase });
      get().render();
    }
  },
  setYScaleTop: (increase) => {
    const yScaleTopPrev = get().yScaleTop;
    const yScaleTop = roundTo(
      increase
        ? Math.min(yScaleTopPrev + Y_TOP_SCALE_STEP, Y_TOP_SCALE_MAX)
        : Math.max(yScaleTopPrev - Y_TOP_SCALE_STEP, Y_TOP_SCALE_MIN)
    );
    if (yScaleTop !== yScaleTopPrev) {
      set({ yScaleTop });
      get().reRenderTop();
    }
  },
  reset: () => {
    set({ ...STATE_DEFAULT });
    get().render();
    get().reRenderTop();
  },
  proxy: {
    object: dataStore.getState().config.object,
    setObject: dataStore.getState().config.setObject,
    startDate: dataStore.getState().dates.start,
    types: dataStore.getState().types.list,
    objectsTimeMap: dataStore.getState().objects.timeMap,
    topObjectsTimeMap: dataStore.getState().topObjects.timeMap,
  },
}));

proxy(
  dataStore,
  bufferStore,
  [(s) => s.config.object, 'object'],
  [(s) => s.dates.start, 'startDate'],
  [(s) => s.types.list, 'types'],
  [(s) => s.objects.timeMap, 'objectsTimeMap'],
  [(s) => s.topObjects.timeMap, 'topObjectsTimeMap']
);

const _generateLine = (
  data: TObjectPrimitive | TObjectDataPrimitive,
  map: Map<string, JSX.Element[]>,
  mapKey: string,
  xScale: number,
  yScale: number,
  setObject: (id?: string) => void,
  object?: string
) => {
  const objectSelected = object !== undefined && object === data.id;
  const objectNotSelected = object !== undefined && object !== data.id;
  const objectHandler = object !== data.id ? () => setObject(data.id) : undefined;

  if ((data as any).from !== undefined) {
    const d = data as TObjectPrimitive;

    const key = `${mapKey} ${d.id} ${d.from} ${d.to} LINE`;
    const lines = map.get(mapKey) ?? [];

    //? Игнорировать если есть в хэше
    if (lines?.find((c) => c.key === key)) return;

    map.set(mapKey, [
      ...lines,
      <Line
        {...d}
        key={key}
        xScale={xScale}
        yScale={yScale}
        color={objectSelected ? SELECTED_COLOR : data.color}
        alpha={objectNotSelected ? 0.33 : 1}
        zIndex={objectSelected ? 1000 : undefined}
        onUp={objectHandler}
      />,
    ]);
  } else {
    const d = data as TObjectDataPrimitive;

    const key = `${mapKey} ${d.id} ${d.point} DATA`;
    const lines = map.get(mapKey) ?? [];

    //? Игнорировать если есть в хэше
    if (lines?.find((c) => c.key === key)) return;

    map.set(mapKey, [
      ...lines,
      <Fragment key={key}>
        {
          //? Лейбл
          d.title && objectSelected && (
            <BGText
              text={d.title}
              pos={d.point}
              xScale={xScale}
              yScale={yScale}
              color={objectSelected ? SELECTED_COLOR : data.color}
              radius={4}
              xAnchor={'left'}
              yAnchor={'bottom'}
              zIndex={objectSelected ? 1000 : undefined}
            />
          )
        }
        {
          //? Вертикальная линия вверх
          !d.title && (
            <Line
              from={d.point}
              to={new Point(d.point.x, -MLN)}
              xScale={xScale}
              color={objectSelected ? SELECTED_COLOR : data.color}
              alpha={objectNotSelected ? 0.33 : 1}
              zIndex={objectSelected ? 1000 : undefined}
              onUp={objectHandler}
            />
          )
        }
      </Fragment>,
    ]);
  }
};

const _generateLineTop = (
  data: TObjectTopPrimitive,
  map: Map<string, JSX.Element[]>,
  mapKey: string,
  xScale: number,
  yScale: number,
  yOffset: number,
  startDate: Date,
  setObject: (id?: string) => void,
  object?: string
) => {
  const key = `${mapKey} ${data.id} ${data.timeFrom} TOPLINE`;
  const lines = map.get(mapKey) ?? [];

  //? Игнорировать если есть в хэше
  if (lines?.find((c) => c.key === key)) return;

  const objectSelected = object !== undefined && object === data.id;
  const objectNotSelected = object !== undefined && object !== data.id;

  map.set(mapKey, [
    ...lines,
    <Operations
      key={key}
      from={new Point(data.timeFrom, data.typeIndex + yOffset)}
      to={new Point(data.timeTo, data.typeIndex + yOffset)}
      xScale={xScale}
      yScale={yScale}
      selected={objectSelected}
      dimmed={objectNotSelected}
      startDate={startDate}
      opers={data.opers}
      color={data.color}
      selectedColor={SELECTED_COLOR}
      zIndex={objectSelected ? MLN * 2 : MLN + data.timeFrom}
      onSelect={object !== data.id ? () => setObject(data.id) : undefined}
    />,
  ]);
};

const roundTo = (number: number, fraction = 10) => Math.floor(number * fraction) / fraction;
const dateToHHMM = (date?: Date) => (date ? date.toISOString().substring(11, 16) : '');
const dateToDDMMYYYY = (date?: Date, splitter = '/', removeYear = false) =>
  date && date.toString() !== 'Invalid Date'
    ? date
        .toISOString()
        .slice(removeYear ? 5 : 0, 10)
        .split('-')
        .reverse()
        .join(splitter ?? '/')
    : '';

import { Stage } from '@pixi/react';
import { Point } from 'pixi.js';
import { ChangeEvent, MouseEvent, WheelEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'; // prettier-ignore
import { MdExtension, MdExtensionOff } from 'react-icons/md';
import { ConfigLine, Line, TViewportBounds, TViewportRef, Viewport } from '../components';
import { TObjectsConfig, TTopObjectsConfig } from '../logic/@types';
import { MLN, bufferStore } from '../logic/bufferStore';
import { dataStore } from '../logic/dataStore';

const aboutUrl = 'https://davydovdev.com/rail-dispatcher';

const BOUNDS_DELAY = 75;
const X_AXIS_HEIGHT = 30;
export const Y_AXIS_WIDTH = 110;
const MS_IN_SEC = 1000;
const STAGE_CONFIG = {
  antialias: true,
  powerPreference: 'high-performance',
  background: 0x222034,
} as any;

let boundsTimeoutId: NodeJS.Timeout | undefined = undefined;
let boundsTopTimeoutId: NodeJS.Timeout | undefined = undefined;

export default () => {
  const [showPrefs, setShowPrefs] = useState(false);

  const autoStartTime = dataStore((s) => s.config.autoStartTime);
  const autoStartTimeToggle = dataStore((s) => s.config.toggleAutoStartTime);
  const typesCount = dataStore((s) => s.config.typesCount);
  const typesCountSet = dataStore((s) => s.config.setTypesCount);
  const objectsConfig = dataStore((s) => s.config.objects);
  const objectsConfigSet = dataStore((s) => s.config.setObjects);
  const topObjectsConfig = dataStore((s) => s.config.topObjects);
  const topObjectsConfigSet = dataStore((s) => s.config.setTopObjects);

  const objectSet = dataStore((s) => s.config.setObject);
  const chartDatesFromBounds = dataStore((s) => s.dates.setBounds);
  const [fetchInterval, setFetchInterval] = useState(0);
  const fetch = dataStore((s) => s.types.fetch);
  const otLoading = dataStore((s) => s.types.loading);
  const oLoading = dataStore((s) => s.objects.loading);
  const toLoading = dataStore((s) => s.topObjects.loading);
  const loading = useMemo(() => {
    return otLoading || oLoading || toLoading;
  }, [otLoading, oLoading, toLoading]);

  const xScale = bufferStore((s) => s.xScale);
  const xScaleSet = bufferStore((s) => s.setXScale);
  const yScale = bufferStore((s) => s.yScale);
  const yScaleSet = bufferStore((s) => s.setYScale);
  const yScaleTop = bufferStore((s) => s.yScaleTop);
  const yScaleTopSet = bufferStore((s) => s.setYScaleTop);

  const gridCurrent = bufferStore((s) => s.gridCurrent);
  const gridCurrentTop = bufferStore((s) => s.gridCurrentTop);
  const sectors =
    gridCurrent.kmsIndexes.length * gridCurrent.timesKeys.length +
    gridCurrentTop.types.length * gridCurrent.timesKeys.length;

  const lines = bufferStore((s) => s.linesBuffer);
  const linesTop = bufferStore((s) => s.linesTopBuffer);
  const xAxis = bufferStore((s) => s.xAxisBuffer);
  const xAxisLines = bufferStore((s) => s.xAxisLinesBuffer);
  const yAxis = bufferStore((s) => s.yAxisBuffer);
  const yAxisLines = bufferStore((s) => s.yAxisLinesBuffer);
  const yAxisTop = bufferStore((s) => s.yAxisTopBuffer);
  const yAxisLinesTop = bufferStore((s) => s.yAxisTopLinesBuffer);
  const length =
    lines.length +
    linesTop.length +
    xAxis.length +
    xAxisLines.length +
    yAxis.length +
    yAxisLines.length +
    yAxisTop.length +
    yAxisLinesTop.length;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperTopRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<TViewportRef>(null);
  const viewportTopRef = useRef<TViewportRef>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [heightTop, setHeightTop] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [yTop, setYTop] = useState(0);
  const [bounds, setBounds] = useState<TViewportBounds>();
  const [boundsTop, setBoundsTop] = useState<TViewportBounds>();

  const [xyTopDragEnabled] = useState(true);
  const [xMoving, setXMoving] = useState(false);
  const xMovingEnable = useCallback(() => setXMoving(true), []);
  const xMovingDisable = useCallback(() => setXMoving(false), []);
  const [yMoving, setYMoving] = useState(false);
  const yMovingEnable = useCallback(() => setYMoving(true), []);
  const yMovingDisable = useCallback(() => setYMoving(false), []);
  const [yTopMoving, setYTopMoving] = useState(false);
  const yTopMovingEnable = useCallback(() => setYTopMoving(true), []);
  const yTopMovingDisable = useCallback(() => setYTopMoving(false), []);
  const [xyMoving, setXYMoving] = useState(false);
  const xyMovingEnable = useCallback(() => setXYMoving(true), []);
  const xyMovingDisable = useCallback(() => setXYMoving(false), []);
  const [xyTopMoving, setXYTopMoving] = useState(false);
  const xyTopMovingEnable = useCallback(() => setXYTopMoving(true), []);
  const xyTopMovingDisable = useCallback(() => setXYTopMoving(false), []);

  const typeChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = +e.target.value;
      if (!Number.isInteger(val) || val < 0) return;
      typesCountSet(val);
    },
    [typesCountSet]
  );

  const fetchIntervalChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = +e.target.value;
      if (!Number.isInteger(val) || val < 0 || val > 999) return;
      setFetchInterval(val);
    },
    [setFetchInterval]
  );

  const objectsConfigChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>, value: keyof TObjectsConfig, place = 0) => {
      const val = +e.target.value;
      if (
        !Number.isInteger(val) ||
        (val < 0 && value !== 'startTime') ||
        (['stayingChance', 'notArrivedChance'].includes(value) && val > 100)
      )
        return;

      let configValue = objectsConfig?.[value];
      if (configValue === undefined) return;

      if (Array.isArray(configValue)) configValue[place] = val;
      else configValue = val;

      objectsConfigSet({ [value]: configValue });
    },
    [objectsConfig, objectsConfigSet]
  );

  const topObjectsConfigChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>, value: keyof TTopObjectsConfig, place = 0) => {
      const val = +e.target.value;
      if (!Number.isInteger(val) || val < 0) return;

      const configValue = topObjectsConfig?.[value];
      if (configValue === undefined) return;
      configValue[place] = val;

      topObjectsConfigSet({ [value]: configValue });
    },
    [topObjectsConfig, topObjectsConfigSet]
  );

  const xScaleHandler = useCallback(
    (e: WheelEvent) => {
      setXMoving(false);
      xScaleSet(e.deltaY < 0);
      clearTimeout(boundsTimeoutId);
      clearTimeout(boundsTopTimeoutId);
    },
    [xScaleSet]
  );

  const yScaleHandler = useCallback(
    (e: WheelEvent) => {
      setYMoving(false);
      yScaleSet(e.deltaY < 0);
      clearTimeout(boundsTimeoutId);
    },
    [yScaleSet]
  );

  const yTopScaleHandler = useCallback(
    (e: WheelEvent) => {
      setYTopMoving(false);
      yScaleTopSet(e.deltaY < 0);
      clearTimeout(boundsTopTimeoutId);
    },
    [yScaleTopSet]
  );

  const scaleHandler = useCallback(
    (e: WheelEvent) => {
      setXMoving(false);
      setYMoving(false);
      xScaleSet(e.deltaY < 0);
      yScaleSet(e.deltaY < 0);
      clearTimeout(boundsTimeoutId);
      clearTimeout(boundsTopTimeoutId);
    },
    [xScaleSet, yScaleSet]
  );

  const topScaleHandler = useCallback(
    (e: WheelEvent) => {
      setXMoving(false);
      setYTopMoving(false);
      xScaleSet(e.deltaY < 0);
      yScaleTopSet(e.deltaY < 0);
      clearTimeout(boundsTimeoutId);
      clearTimeout(boundsTopTimeoutId);
    },
    [xScaleSet, yScaleTopSet]
  );

  const xMoveHandler = useCallback(
    (raw: TViewportBounds) => viewportRef.current?.moveCornerRaw(raw.tl.x, y),
    [y]
  );

  const yMoveHandler = useCallback(
    (raw: TViewportBounds) => viewportRef.current?.moveCornerRaw(x, raw.tl.y),
    [x]
  );

  const yTopMoveHandler = useCallback(
    (raw: TViewportBounds) => viewportTopRef.current?.moveCornerRaw(x, raw.tl.y),
    [x]
  );

  const moveHandler = useCallback((raw: TViewportBounds, b: TViewportBounds) => {
    setX(raw.tl.x);
    setY(raw.tl.y);
    setBounds(b);
  }, []);

  const topMoveHandler = useCallback((raw: TViewportBounds, b: TViewportBounds) => {
    setX(raw.tl.x);
    setYTop(raw.tl.y);
    setBoundsTop(b);
  }, []);

  const rightMouseBlockHandler = useCallback((e: MouseEvent) => e.preventDefault(), []);

  useEffect(() => {
    document.title = 'DavydovDev.com | Chart';
  }, []);

  //? Измеряет окно графика
  useEffect(() => {
    if (!wrapperTopRef.current || !wrapperRef.current) return;
    const measure = () => {
      const width = wrapperRef.current!.getBoundingClientRect().width;
      const height = wrapperRef.current!.getBoundingClientRect().height;
      setWidth(Math.max(width, 0));
      setHeight(Math.max(height, 0));
    };
    const measureTop = () => {
      const height = wrapperTopRef.current!.getBoundingClientRect().height;
      setHeightTop(Math.max(height, 0));
    };
    measure();
    measureTop();
    window.addEventListener('resize', measure);
    window.addEventListener('resize', measureTop);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('resize', measureTop);
    };
  }, [wrapperTopRef, wrapperRef]);

  //? Передает границы нижнего графика для конвертации крайних значений оси x в даты
  useEffect(() => {
    chartDatesFromBounds(bounds?.tl.x, bounds?.br.x);
  }, [bounds, chartDatesFromBounds]);

  //? Генерирует при смене интервала / запуске
  useEffect(() => {
    let intervalId: number | undefined = undefined;
    if (fetchInterval > 0) intervalId = window.setInterval(fetch, fetchInterval * MS_IN_SEC);
    else {
      setTimeout(fetch, 250);
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [fetchInterval, fetch]);

  //? Рендеринг

  const reset = bufferStore((s) => s.reset);
  const gridGenerate = bufferStore((s) => s.gridGenerate);
  const gridGenerateTop = bufferStore((s) => s.gridGenerateTop);
  const object = bufferStore((s) => s.proxy.object);
  const objectsTimeMap = bufferStore((s) => s.proxy.objectsTimeMap);
  const linesRender = bufferStore((s) => s.linesRender);
  const topObjectsTimeMap = bufferStore((s) => s.proxy.topObjectsTimeMap);
  const linesRenderTop = bufferStore((s) => s.linesRenderTop);
  const types = bufferStore((s) => s.proxy.types);
  const render = bufferStore((s) => s.render);
  const reRenderTop = bufferStore((s) => s.reRenderTop);

  useEffect(() => {
    setTimeout(() => {
      viewportRef.current?.moveCornerRaw(0, -15);
      setTimeout(() => viewportTopRef.current?.moveCornerRaw(-width / 2, 0), 0);
    }, 0);
    reset();
  }, [types.length, width, viewportTopRef, reset]);

  useEffect(() => {
    linesRender();
  }, [object, objectsTimeMap, linesRender]);

  useEffect(() => {
    linesRenderTop();
  }, [object, topObjectsTimeMap, linesRenderTop]);

  useEffect(() => {
    render();
    reRenderTop();
  }, [types, render, reRenderTop]);

  useEffect(() => {
    if (bounds) boundsTimeoutId = setTimeout(() => gridGenerate(bounds), BOUNDS_DELAY);
  }, [bounds, gridGenerate]);

  useEffect(() => {
    if (boundsTop)
      boundsTopTimeoutId = setTimeout(() => gridGenerateTop(boundsTop), BOUNDS_DELAY);
  }, [boundsTop, gridGenerateTop]);

  return (
    <div className={'root flex flex-col bg-aTextBlack'} onContextMenu={rightMouseBlockHandler}>
      <div ref={wrapperTopRef} className='relative h-1/3'>
        <Stage
          className='absolute right-0'
          options={STAGE_CONFIG}
          onPointerDown={xyTopMovingEnable}
          onPointerLeave={xyTopMovingDisable}
          onWheel={topScaleHandler}
        >
          <Viewport
            dragEnabled={xyTopDragEnabled}
            clampOptions={{ yFrom: 0.2, yTo: types.length - 1.2 + heightTop / yScaleTop }}
            ref={viewportTopRef}
            width={width - Y_AXIS_WIDTH}
            height={heightTop}
            xScale={xScale}
            yScale={yScaleTop}
            currentlyMoving={xyTopMoving}
            onMove={topMoveHandler}
          >
            {xAxisLines}
            {yAxisLinesTop}
            {linesTop}
          </Viewport>
        </Stage>
        <Stage
          className='absolute'
          options={STAGE_CONFIG}
          onPointerDown={yTopMovingEnable}
          onPointerLeave={yTopMovingDisable}
          onWheel={yTopScaleHandler}
        >
          <Viewport
            dragEnabled
            width={Y_AXIS_WIDTH}
            height={heightTop}
            yPos={yTop}
            dragDirection={'y'}
            currentlyMoving={yTopMoving}
            onMove={yTopMoveHandler}
          >
            {yAxisTop}
          </Viewport>
        </Stage>
      </div>
      <div className={'relative'} style={{ height: X_AXIS_HEIGHT }}>
        <Stage
          className='absolute right-0'
          options={STAGE_CONFIG}
          onPointerDown={xMovingEnable}
          onPointerLeave={xMovingDisable}
          onWheel={xScaleHandler}
        >
          <Viewport
            dragEnabled
            width={width - Y_AXIS_WIDTH}
            height={X_AXIS_HEIGHT}
            xPos={x}
            dragDirection={'x'}
            currentlyMoving={xMoving}
            onMove={xMoveHandler}
          >
            {xAxisLines}
            {xAxis}
          </Viewport>
        </Stage>
        <Stage
          className='absolute'
          width={Y_AXIS_WIDTH}
          height={X_AXIS_HEIGHT}
          options={STAGE_CONFIG}
        />
      </div>
      <div ref={wrapperRef} className='relative h-2/3'>
        <div className='absolute bottom-2 right-2 z-50 flex select-none flex-col gap-3 rounded-lg bg-aTextBlack bg-opacity-75 p-4 text-aTextWhite'>
          <div className='flex flex-col gap-2'>
            <a href={aboutUrl} onClick={(e) => e.preventDefault()}>
              <button
                className='m-0 w-full animate-aFadeInScale select-none p-0 text-start text-aTextWhite underline transition-all hover:text-white'
                disabled={loading}
                onClick={() => openNewTab(aboutUrl)}
              >
                Подробнее / исходники: davydovdev.com
              </button>
            </a>
            {showPrefs && (
              <>
                <ConfigLine
                  title='Количество категорий'
                  value={typesCount}
                  disabled={loading}
                  onChange={typeChangeHandler}
                />
                <ConfigLine
                  title='Объектов в катег.'
                  value={objectsConfig.objectsCount}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'objectsCount', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'objectsCount', 1)}
                />
                <ConfigLine
                  title='Точек в объектах'
                  value={objectsConfig.pointsCount}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'pointsCount', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'pointsCount', 1)}
                />
                <ConfigLine
                  title='Километры точки'
                  value={objectsConfig.pointKm}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'pointKm', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'pointKm', 1)}
                />
                <ConfigLine
                  title='Минуты точки'
                  value={objectsConfig.pointTime}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'pointTime', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'pointTime', 1)}
                />
                <ConfigLine
                  title='Вероятность остановки (%)'
                  value={objectsConfig.stayingChance}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'stayingChance')}
                />
                <ConfigLine
                  title='Делитель времени остановки'
                  value={objectsConfig.stayingTimeDivider}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'stayingTimeDivider')}
                />
                <div className='flex justify-between gap-2 text-aTextWhite'>
                  <div>Прибытие по окну (Viewport):</div>
                  <input
                    className='w-4 accent-aTextWhite'
                    type='checkbox'
                    checked={autoStartTime}
                    onClick={autoStartTimeToggle}
                  />
                </div>
                <ConfigLine
                  title='Прибытие (мин)'
                  value={objectsConfig.startTime}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'startTime', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'startTime', 1)}
                />
                <ConfigLine
                  title='Вероятность неприбытия (%)'
                  value={objectsConfig.notArrivedChance}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'notArrivedChance')}
                />
                <ConfigLine
                  title='Км до 0 (неприб)'
                  value={objectsConfig.notArrivedKm}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'notArrivedKm', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'notArrivedKm', 1)}
                />
                <ConfigLine
                  title='Операций в об.'
                  value={topObjectsConfig.opersCount}
                  disabled={loading}
                  onChange={(e) => topObjectsConfigChangeHandler(e, 'opersCount', 0)}
                  onChange2={(e) => topObjectsConfigChangeHandler(e, 'opersCount', 1)}
                />
                <ConfigLine
                  title='Длина операции'
                  value={topObjectsConfig.opersLength}
                  disabled={loading}
                  onChange={(e) => topObjectsConfigChangeHandler(e, 'opersLength', 0)}
                  onChange2={(e) => topObjectsConfigChangeHandler(e, 'opersLength', 1)}
                />
                <ConfigLine
                  title='Интервал генерации (сек)'
                  value={fetchInterval}
                  onChange={fetchIntervalChangeHandler}
                />
              </>
            )}
          </div>
          <div className='flex gap-2'>
            <button
              title={showPrefs ? 'Скрыть параметры генерации' : 'Показать параметры генерации'}
              className='text-aTextWhite hover:text-white active:animate-aFadeIn'
              onMouseDown={() => setShowPrefs((s) => !s)}
            >
              {showPrefs ? <MdExtensionOff size={24} /> : <MdExtension size={24} />}
            </button>
            <button
              key={String(loading)}
              className='w-full animate-aFadeInScale select-none rounded-md bg-white py-1 text-center text-aTextBlack shadow-md transition-all hover:bg-aTextWhite disabled:cursor-not-allowed'
              disabled={loading}
              onClick={fetch}
            >
              {loading ? 'Загрузка' : 'Сгенерировать данные'}
            </button>
          </div>
          <div>
            <div className='flex justify-between'>
              <div className='flex gap-1'>
                <div>Выбранный ID:</div>
                <div key={object} className='animate-aFadeInScale'>
                  {object ?? 'Не выбран'}
                </div>
              </div>
              {object && (
                <button className='animate-aFadeInScale' onClick={() => objectSet()}>
                  ✖
                </button>
              )}
            </div>
            <div className='flex gap-1'>
              <div>Секторов на экране:</div>
              <div className='animate-aFadeInScale'>{sectors}</div>
            </div>
            <div className='flex gap-1'>
              <div>Объектов в буфере:</div>
              <div className='animate-aFadeInScale'>{length}</div>
            </div>
          </div>
        </div>
        <Stage
          className='absolute right-0'
          options={STAGE_CONFIG}
          onPointerDown={xyMovingEnable}
          onPointerLeave={xyMovingDisable}
          onWheel={scaleHandler}
        >
          <Viewport
            dragEnabled
            clampOptions={{ yFrom: height / (yScale * 2) }}
            ref={viewportRef}
            width={width - Y_AXIS_WIDTH}
            height={height}
            xScale={xScale}
            yScale={yScale}
            currentlyMoving={xyMoving}
            onMove={moveHandler}
          >
            {/*//TODO FIX */}
            <Line from={new Point(0, 0)} to={new Point(0, MLN)} alpha={0} />
            {xAxisLines}
            {yAxisLines}
            {lines}
          </Viewport>
        </Stage>
        <Stage
          className='absolute'
          options={STAGE_CONFIG}
          onPointerDown={yMovingEnable}
          onPointerLeave={yMovingDisable}
          onWheel={yScaleHandler}
        >
          <Viewport
            dragEnabled
            width={Y_AXIS_WIDTH}
            height={height}
            yPos={y}
            dragDirection={'y'}
            currentlyMoving={yMoving}
            onMove={yMoveHandler}
          >
            {yAxis}
          </Viewport>
        </Stage>
      </div>
    </div>
  );
};

export const openNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

import { Stage, _ReactPixi } from '@pixi/react';
import { Point } from 'pixi.js';
import { ChangeEvent, MouseEvent, WheelEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'; // prettier-ignore
import { MdExtension, MdExtensionOff } from 'react-icons/md';
import lmb from '../assets/lmb.svg';
import scroll from '../assets/scroll.svg';
import { ConfigLine, Line, TViewportBounds, TViewportRef, Viewport } from '../components';
import { TObjectsConfig, TTopObjectsConfig } from '../logic/@types';
import { MLN, MS_IN_SEC, bufferStore } from '../logic/bufferStore';
import { dataStore } from '../logic/dataStore';

const aboutUrl = 'https://davydovdev.com/rail-dispatcher';

const X_AXIS_HEIGHT = 30;
export const Y_AXIS_WIDTH = 110;
const STAGE_CONFIG = {
  antialias: true,
  powerPreference: 'high-performance',
  background: 0x222034,
} as _ReactPixi.IStage;

export default () => {
  const [showPrefs, setShowPrefs] = useState(false);
  const toggleShowPrefs = useCallback(() => setShowPrefs((s) => !s), []);
  const showPrefsIcon = useMemo(
    () => (showPrefs ? <MdExtensionOff size={24} /> : <MdExtension size={24} />),
    [showPrefs]
  );

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
  const typesLoading = dataStore((s) => s.types.loading);
  const objectsLoading = dataStore((s) => s.objects.loading);
  const topObjectsLoading = dataStore((s) => s.topObjects.loading);
  const loading = useMemo(() => {
    return typesLoading || objectsLoading || topObjectsLoading;
  }, [typesLoading, objectsLoading, topObjectsLoading]);

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
  const objectsInBuffer =
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

  const typesCountChangeHandler = useCallback(
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
    (
      e: ChangeEvent<HTMLInputElement>,
      valKey: keyof TObjectsConfig | keyof TTopObjectsConfig,
      place = 0
    ) => {
      const topObject = ['opersCount', 'opersLength'].includes(valKey);
      const val = +e.target.value;
      if (
        !Number.isInteger(val) ||
        (['startTime', 'opersCount', 'opersLength'].includes(valKey) && val < 0) ||
        (['stayingChance', 'notArrivedChance'].includes(valKey) && val > 100)
      )
        return;

      let configValue = topObject
        ? topObjectsConfig?.[valKey as keyof TTopObjectsConfig]
        : objectsConfig?.[valKey as keyof TObjectsConfig];
      if (configValue === undefined) return;

      if (Array.isArray(configValue)) configValue[place] = val;
      else configValue = val;

      if (topObject) topObjectsConfigSet({ [valKey]: configValue });
      else objectsConfigSet({ [valKey]: configValue });
    },
    [objectsConfig, topObjectsConfig, objectsConfigSet, topObjectsConfigSet]
  );

  const xScaleHandler = useCallback(
    (e: WheelEvent) => {
      setXMoving(false);
      xScaleSet(e.deltaY < 0);
    },
    [xScaleSet]
  );

  const yScaleHandler = useCallback(
    (e: WheelEvent) => {
      setYMoving(false);
      yScaleSet(e.deltaY < 0);
    },
    [yScaleSet]
  );

  const yTopScaleHandler = useCallback(
    (e: WheelEvent) => {
      setYTopMoving(false);
      yScaleTopSet(e.deltaY < 0);
    },
    [yScaleTopSet]
  );

  const scaleHandler = useCallback(
    (e: WheelEvent) => {
      setXMoving(false);
      setYMoving(false);
      xScaleSet(e.deltaY < 0);
      yScaleSet(e.deltaY < 0);
    },
    [xScaleSet, yScaleSet]
  );

  const topScaleHandler = useCallback(
    (e: WheelEvent) => {
      setXMoving(false);
      setYTopMoving(false);
      xScaleSet(e.deltaY < 0);
      yScaleTopSet(e.deltaY < 0);
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
  const [initRender, setInitRender] = useState(true);
  useEffect(() => {
    let intervalId: number | undefined = undefined;
    if (fetchInterval > 0) intervalId = window.setInterval(fetch, fetchInterval * MS_IN_SEC);
    else {
      setTimeout(fetch, initRender ? 500 : 0);
      clearInterval(intervalId);
      setInitRender(false);
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useLayoutEffect(() => {
    if (bounds) gridGenerate(bounds);
  }, [bounds, gridGenerate]);

  useLayoutEffect(() => {
    if (boundsTop) gridGenerateTop(boundsTop);
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
                  onChange={typesCountChangeHandler}
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
                    defaultChecked={autoStartTime}
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
                  onChange={(e) => objectsConfigChangeHandler(e, 'opersCount', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'opersCount', 1)}
                />
                <ConfigLine
                  title='Длина операции'
                  value={topObjectsConfig.opersLength}
                  disabled={loading}
                  onChange={(e) => objectsConfigChangeHandler(e, 'opersLength', 0)}
                  onChange2={(e) => objectsConfigChangeHandler(e, 'opersLength', 1)}
                />
                <ConfigLine
                  title='Интервал генерации (сек)'
                  value={fetchInterval}
                  onChange={fetchIntervalChangeHandler}
                />
              </>
            )}
            {!showPrefs && (
              <div className='flex flex-col gap-2 text-sm'>
                <div className='flex justify-around'>
                  <div className='flex'>
                    <img src={lmb} className='h-6 w-6 object-contain' />
                    Перемещение
                  </div>
                  <div className='flex'>
                    <img src={scroll} className='h-6 w-6 object-contain' />
                    Масштабирование
                  </div>
                </div>
                <p className='w-72 '>
                  Средства управления зависят от текущего положения курсора – попробуйте
                  использовать их на разных осях, а также в верхней и нижней частях графика.
                </p>
                <p className='w-72'>
                  {`Все объекты интерактивны – нажмите на линюю чтобы выбрать объект. Для отмены
                  выбора нажмите ✖ в поле "Выбранный ID" ниже.`}
                </p>
              </div>
            )}
          </div>
          <div className='flex gap-2'>
            <button
              title={showPrefs ? 'Скрыть параметры генерации' : 'Показать параметры генерации'}
              className='text-aTextWhite hover:text-white active:animate-aFadeIn'
              onMouseDown={toggleShowPrefs}
            >
              {showPrefsIcon}
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
              <button
                className='transition-all disabled:cursor-not-allowed disabled:opacity-50'
                disabled={!object}
                onClick={() => objectSet()}
              >
                ✖
              </button>
            </div>
            <div className='flex gap-1'>
              <div>Секторов на экране:</div>
              <div className='animate-aFadeInScale'>{sectors}</div>
            </div>
            <div className='flex gap-1'>
              <div>Объектов в буфере:</div>
              <div className='animate-aFadeInScale'>{objectsInBuffer}</div>
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
            {/*//? Заполнить Viewport при пустом буфере для рассчета высоты */}
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

const openNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

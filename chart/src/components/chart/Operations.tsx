import { Point, TextStyle } from 'pixi.js';
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { BGText, Line } from '..';

const MLN = 1000000;
const MS_IN_MIN = 60000;
const MIN_IN_HOUR = 60;
const OPERS_FONT_SIZE = 11;

export type TOperations = {
  from: Point;
  to: Point;
  startDate: Date;
  xScale?: number;
  yScale?: number;
  selected?: boolean;
  dimmed?: boolean;
  opers?: { length: number; type: string }[];
  color?: number;
  selectedColor?: number;
  alpha?: number;
  width?: number;
  zIndex?: number;
  onSelect?: () => void;
};

export const Operations: FC<TOperations> = ({
  xScale = 1,
  yScale = 1,
  alpha = 1,
  width = 2,
  ...p
}) => {
  const [arrivalHover, setArrivalHover] = useState(false);
  const [opersHover, setOpersHover] = useState(() => p.opers?.map(() => false) ?? []);

  const opersUnselectedPos = useMemo(() => {
    if (p.selected || !p.opers || !p.opers.length) return [];
    const opersPos = [];
    let length = 0;
    for (const oper of p.opers) {
      length += oper.length;
      opersPos.push(new Point(p.from.x + length, p.from.y));
    }
    return opersPos;
  }, [p.selected, p.from, p.opers]);

  const opersSelectedPos = useMemo(() => {
    if (!p.selected || !p.opers || !p.opers.length) return [];
    const opersPos = [];
    let height = -p.opers.length * OPERS_FONT_SIZE;
    let length = 0;
    for (const oper of p.opers) {
      length += oper.length;
      opersPos.push(new Point(p.from.x + length, p.from.y + height / yScale));
      height += OPERS_FONT_SIZE;
    }
    return opersPos;
  }, [p.selected, p.from, p.opers, yScale]);

  const opersHints = useMemo(() => {
    const operHints = [];
    let length = 0;
    for (const oper of p.opers ?? []) {
      length += oper.length;
      operHints.push(
        `${dateToHHMM(new Date(p.startDate.getTime() + (p.from.x + length) * MS_IN_MIN))}: ${
          oper.type
        }`
      );
    }
    return operHints;
  }, [p.opers, p.from.x, p.startDate]);

  const hoverArrivalStart = useCallback(() => setArrivalHover(true), []);
  const hoverArrivalEnd = useCallback(() => setArrivalHover(false), []);
  const hoverOpersStart = useCallback(
    (i: number) =>
      setOpersHover((prev) => {
        prev[i] = true;
        return [...prev];
      }),
    []
  );
  const hoverOpersEnd = useCallback(
    (i: number) =>
      setOpersHover((prev) => {
        prev[i] = false;
        return [...prev];
      }),
    []
  );

  const alphaToUse = useMemo(() => alpha / (p.dimmed ? 3 : 1), [p.dimmed, alpha]);
  const colorToUse = useMemo(() => {
    return p.selected ? p.selectedColor : p.color;
  }, [p.selected, p.color, p.selectedColor]);

  useEffect(() => {
    setOpersHover(new Array(opersHover.length).fill(false));
  }, [opersHover.length, p.selected]);

  useEffect(() => {
    if (!p.selected) {
      setArrivalHover(false);
      setOpersHover(new Array(opersHover.length).fill(false));
    }
  }, [opersHover.length, p.selected]);

  return (
    <>
      <Line
        from={new Point(p.from.x, MLN)}
        to={p.from}
        xScale={xScale}
        yScale={yScale}
        color={colorToUse}
        alpha={alphaToUse}
        width={width}
        zIndex={p.zIndex}
        onUp={p.onSelect}
      />
      <Line
        from={p.from}
        to={p.to}
        xScale={xScale}
        yScale={yScale}
        color={colorToUse}
        alpha={alphaToUse}
        width={width}
        zIndex={p.zIndex}
        onUp={p.onSelect}
      />
      <Line
        from={p.to}
        to={new Point(p.to.x, p.to.y + 10 / yScale)}
        xScale={xScale}
        yScale={yScale}
        color={colorToUse}
        alpha={alphaToUse}
        width={width}
        zIndex={p.zIndex}
        onUp={p.onSelect}
      />
      <Line
        from={new Point(p.to.x, p.to.y + 10 / yScale)}
        to={new Point(p.to.x + MIN_IN_HOUR / (4 * xScale), p.to.y + 15 / yScale)}
        xScale={xScale}
        yScale={yScale}
        color={colorToUse}
        alpha={alphaToUse}
        width={width}
        zIndex={p.zIndex}
        onUp={p.onSelect}
      />
      {p.selected && (
        <BGText
          noBg
          pos={p.from}
          xScale={xScale}
          yScale={yScale}
          xAnchor={'left'}
          yAnchor={'top'}
          text={dateToHHMM(new Date(p.startDate.getTime() + p.from.x * MS_IN_MIN))}
          textStyle={new TextStyle({ fontSize: OPERS_FONT_SIZE, fill: colorToUse })}
          zIndex={p.zIndex}
        />
      )}
      {!p.selected && (
        <>
          {arrivalHover && (
            <BGText
              pos={new Point(p.from.x, p.from.y - 10 / yScale)}
              xScale={xScale}
              yScale={yScale}
              xAnchor={'center'}
              yAnchor={'top'}
              text={dateToHHMM(new Date(p.startDate.getTime() + p.from.x * MS_IN_MIN))}
              color={colorToUse}
              radius={4}
              zIndex={p.zIndex ? MLN + p.zIndex! : undefined}
            />
          )}
          <Line
            from={p.from}
            to={new Point(p.from.x, p.from.y - 10 / yScale)}
            xScale={xScale}
            yScale={yScale}
            color={colorToUse}
            alpha={alphaToUse / 2}
            width={width * 2}
            onUp={p.onSelect}
            onHover={hoverArrivalStart}
            onHoverOut={hoverArrivalEnd}
          />
        </>
      )}
      {p.selected &&
        opersSelectedPos?.map((l, i) => (
          <Fragment key={i}>
            <Line
              from={new Point(l.x, l.y)}
              to={new Point(l.x, p.from.y)}
              xScale={xScale}
              yScale={yScale}
              color={colorToUse}
              alpha={alphaToUse}
              width={width}
              zIndex={p.zIndex}
            />
            <BGText
              noBg
              pos={new Point(l.x - 3 / xScale, l.y)}
              xScale={xScale}
              yScale={yScale}
              xAnchor={'right'}
              yAnchor={'top'}
              text={opersHints[i]}
              textStyle={new TextStyle({ fontSize: OPERS_FONT_SIZE, fill: colorToUse })}
              zIndex={p.zIndex}
            />
          </Fragment>
        ))}
      {!p.selected &&
        !p.dimmed &&
        opersUnselectedPos?.map((l, i) => (
          <Fragment key={i}>
            {opersHover[i] && (
              <BGText
                pos={new Point(l.x, l.y - 10 / yScale)}
                xScale={xScale}
                yScale={yScale}
                xAnchor={'center'}
                yAnchor={'top'}
                text={opersHints[i]}
                color={colorToUse}
                radius={4}
                zIndex={p.zIndex ? MLN + p.zIndex : undefined}
              />
            )}
            <Line
              from={new Point(l.x, l.y - 10 / yScale)}
              to={new Point(l.x, l.y)}
              xScale={xScale}
              yScale={yScale}
              color={colorToUse}
              alpha={alphaToUse / 2}
              width={width * 2}
              onUp={p.onSelect}
              onHover={() => hoverOpersStart(i)}
              onHoverOut={() => hoverOpersEnd(i)}
            />
          </Fragment>
        ))}
    </>
  );
};

const dateToHHMM = (date?: Date) => (date ? date.toISOString().substring(11, 16) : '');

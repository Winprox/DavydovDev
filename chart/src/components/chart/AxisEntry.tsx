import { Point, TextStyle } from 'pixi.js';
import { FC } from 'react';
import { BGText, GridLine, TBGText } from '..';

type Props = {
  pos: number;
  scale?: number;
  crossPos?: number;
  to?: number;
  textWidthPercent?: number;
  selected?: boolean;
  vertical?: boolean;
};

export type TAxisEntry = Omit<TBGText, keyof Props> & Props;

export const AxisEntry: FC<TAxisEntry> = ({
  textStyle,
  pos,
  scale = 1,
  crossPos = 0,
  to,
  textWidthPercent = 1,
  selected,
  vertical,
  ...p
}) => {
  const posScaled = vertical
    ? new Point(pos * scale, crossPos)
    : new Point(crossPos, pos * scale);

  const style = new TextStyle({
    ...textStyle,
    fontWeight: selected ? '900' : '400',
    wordWrap: !vertical,
    wordWrapWidth: to ? to * textWidthPercent : undefined
  });

  return (
    <>
      {!vertical && <GridLine pos={posScaled.y} from={0} to={to ?? 0} />}
      {!!p.text && (
        <BGText
          {...p}
          textStyle={style}
          pos={posScaled}
          xAnchor={vertical ? 'center' : 'right'}
          yAnchor={vertical ? 'bottom' : 'center'}
        />
      )}
    </>
  );
};

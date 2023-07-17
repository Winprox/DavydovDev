import { PixiComponent, Text } from '@pixi/react';
import { Graphics, Point, Rectangle, TextMetrics as TM, TextStyle } from 'pixi.js';
import { FC } from 'react';

const BG_COLOR = 0x222034;
const FONT_SIZE = 14;
const FONT_WHITE = 0xffffff;
const FONT_BLACK = 0x00;
const FONT_STYLE_BASE = { breakWords: true, letterSpacing: 0 };

type TBGComponent = {
  text: string;
  textStyle?: TextStyle | Partial<TextStyle>;
  pos: Point;
  padding?: number;
  color?: number;
  alpha?: number;
  radius?: number;
  xAnchor?: 'left' | 'center' | 'right';
  yAnchor?: 'top' | 'center' | 'bottom';
  zIndex?: number;
};

const BGComponent = PixiComponent<TBGComponent, Graphics>('TextBG', {
  create: () => {
    const g = new Graphics();
    g.cullable = true;
    return g;
  },
  willUnmount: (g) => g.removeAllListeners(),
  applyProps: (
    g,
    _,
    {
      text,
      textStyle,
      pos,
      padding = 2,
      color = BG_COLOR,
      alpha = 1,
      radius = 0,
      xAnchor = 'center',
      yAnchor = 'top',
      zIndex = 0
    }
  ) => {
    g.clear().lineStyle({ width: 0 }).beginFill(color, alpha);

    if (textStyle && !textStyle?.fontSize) textStyle.fontSize = FONT_SIZE;
    const tm = TM.measureText(text, new TextStyle({ ...FONT_STYLE_BASE, ...textStyle }));

    const xAnchored = xAnchor === 'center' ? tm.width / 2 : xAnchor === 'left' ? tm.width : 0;
    const yAnchored = yAnchor === 'bottom' ? 0 : yAnchor === 'top' ? tm.height : tm.height / 2;

    const r = new Rectangle(
      pos.x - xAnchored - padding,
      pos.y - yAnchored - padding,
      tm.width + padding * 2,
      tm.height + padding * 2
    );

    const rect: [number, number, number, number] = [r.x, r.y, r.width, r.height];
    if (radius !== 0) g.drawRoundedRect(...rect, radius);
    else g.drawRect(...rect);

    g.cullArea = new Rectangle(pos.x, pos.y, 1, 1);
    g.zIndex = zIndex;
  }
});

export type TBGText = TBGComponent & { noBg?: boolean; xScale?: number; yScale?: number };

export const BGText: FC<TBGText> = ({
  noBg,
  xScale = 1,
  yScale = 1,
  pos,
  textStyle,
  color = BG_COLOR,
  ...p
}) => {
  const posScaled = new Point(pos.x * xScale, pos.y * yScale);

  const style: Partial<TextStyle> = {
    ...FONT_STYLE_BASE,
    ...textStyle,
    fontSize: textStyle?.fontSize ?? FONT_SIZE,
    fill:
      textStyle?.fill ?? !noBg
        ? calculateBGBasedColor(color, FONT_WHITE, FONT_BLACK)
        : FONT_WHITE
  };

  return (
    <>
      {!noBg && <BGComponent {...p} pos={posScaled} textStyle={style} color={color} />}
      <Text
        cullable
        cullArea={new Rectangle(0, 0, 1, 1)}
        hitArea={new Rectangle()}
        position={posScaled}
        text={p.text}
        style={style as TextStyle}
        anchor={[
          p.xAnchor ? (p.xAnchor === 'center' ? 0.5 : p.xAnchor === 'left' ? 1 : 0) : 0.5,
          p.yAnchor ? (p.yAnchor === 'center' ? 0.5 : p.yAnchor === 'top' ? 1 : 0) : 1
        ]}
        zIndex={p.zIndex ? p.zIndex + 1 : 0}
      />
    </>
  );
};

const colorToHex = (color: number) => {
  let hex = color.toString(16);
  if (hex.length < 2) hex = `0${hex}`;
  return hex;
};

const calculateBGBasedColor = (bg: number, light: number, dark: number) => {
  const bgHex = colorToHex(bg);
  const red = parseInt(bgHex.substring(0, 2), 16);
  const green = parseInt(bgHex.substring(2, 4), 16);
  const blue = parseInt(bgHex.substring(4, 6), 16);
  const colors = [red / 255, green / 255, blue / 255];
  const c = colors.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const luminance = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return luminance > 0.179 ? dark : light;
};

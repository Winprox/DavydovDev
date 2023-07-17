import { PixiComponent } from '@pixi/react';
import { Graphics, Point, Rectangle } from 'pixi.js';

const COLOR_LINE = 0xffffff;
const COLOR_GRID_LINE = 0x616161;

type TLine = {
  from: Point;
  to: Point;
  xScale?: number;
  yScale?: number;
  color?: number;
  alpha?: number;
  width?: number;
  zIndex?: number;
  onUp?: () => void;
  onHover?: () => void;
  onHoverOut?: () => void;
};

export const Line = PixiComponent<TLine, Graphics>('Line', {
  create: () => {
    const g = new Graphics();
    g.cullable = true;
    return g;
  },
  willUnmount: (g) => g.removeAllListeners(),
  applyProps: (
    g,
    _,
    { xScale = 1, yScale = 1, width = 2, alpha = 1, zIndex = 0, color = COLOR_LINE, ...p }
  ) => {
    g.clear().beginFill(color, alpha);

    g.removeAllListeners();
    g.interactive = !!p.onUp || !!p.onHover || !!p.onHoverOut;
    if (p.onUp) g.on('pointerup', p.onUp);
    if (p.onHover) g.on('mouseover', p.onHover);
    if (p.onHoverOut) g.on('mouseout', p.onHoverOut);

    const fromScaled = new Point(p.from.x * xScale, p.from.y * yScale);
    const toScaled = new Point(p.to.x * xScale, p.to.y * yScale);
    const a = toScaled.x - fromScaled.x;
    const b = toScaled.y - fromScaled.y;
    const distance = Math.sqrt(a * a + b * b);
    const angle = Math.atan2(b, a);

    g.position = fromScaled;
    g.rotation = angle;
    g.pivot = fromScaled;

    const rect = new Rectangle(fromScaled.x, fromScaled.y, distance, width);
    g.drawRect(rect.x, rect.y, rect.width, rect.height);

    g.cullArea = rect;
    g.zIndex = zIndex;
  }
});

export type TGridLine = {
  pos: number;
  scale?: number;
  from: number;
  to: number;
  color?: number;
  width?: number;
  vertical?: boolean;
};

export const GridLine = PixiComponent<TGridLine, Graphics>('GridLine', {
  create: () => new Graphics(),
  applyProps: (g, _, { scale = 1, width = 1, color = COLOR_GRID_LINE, ...p }) => {
    g.clear().lineStyle({ width, color });
    const posScaled = p.pos * scale;
    if (p.vertical) g.moveTo(posScaled, p.from).lineTo(posScaled, p.to);
    else g.moveTo(p.from, posScaled).lineTo(p.to, posScaled);
  }
});

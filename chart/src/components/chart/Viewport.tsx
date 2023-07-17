import { PixiComponent, useApp } from '@pixi/react';
import { Viewport as PViewport } from 'pixi-viewport';
import { Application, Point } from 'pixi.js';
import { ReactNode, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'; // prettier-ignore

export type TClamp = { xFrom?: number; xTo?: number; yFrom?: number; yTo?: number };
export type TViewportBounds = { tl: Point; br: Point };
export type TViewportRef = {
  moveCenter: (x: number, y: number) => void;
  moveCornerRaw: (x: number, y: number) => void;
};

type TViewport = {
  children?: ReactNode;
  width: number;
  height: number;
  xPos?: number;
  yPos?: number;
  xScale?: number;
  yScale?: number;
  clampOptions?: TClamp;
  dragEnabled?: boolean;
  dragDirection?: string;
  currentlyMoving?: boolean;
  onMove?: (boundsRaw: TViewportBounds, bounds: TViewportBounds) => void;
};

const ViewportComponent = PixiComponent('Viewport', {
  create: (config: { app: Application; children?: ReactNode }) => {
    const vp = new PViewport({ events: config.app.renderer.events });
    vp.sortableChildren = true;
    return vp;
  },
  willUnmount: (v, c) => {
    v.destroy();
    c.destroy();
  }
});

export const Viewport = forwardRef<TViewportRef, TViewport>(
  ({ xScale = 1, yScale = 1, onMove, ...p }, ref) => {
    const app = useApp();
    const vpRef = useRef<PViewport>(null);
    const xScalePrev = usePrevious(xScale);
    const yScalePrev = usePrevious(yScale);

    //? Методы изменения положения Viewport
    useImperativeHandle(ref, () => ({
      moveCenter(x: number, y: number) {
        const vp = vpRef.current;
        if (!vp) return;
        const rawX = x * xScale;
        const rawY = y * yScale;
        vp.moveCenter(rawX, rawY);
        onMoveHandler(vp);
      },
      moveCornerRaw(x: number, y: number) {
        const vp = vpRef.current;
        if (!vp) return;
        vp.moveCorner(x, y);
        onMoveHandler(vp);
      }
    }));

    //? Отслеживает изменения ViewportBounds
    const onMoveHandler = useCallback(
      (vp: PViewport) => {
        if (!onMove) return;

        const tlRaw = new Point(-vp.position.x, -vp.position.y);
        const brRaw = new Point(
          tlRaw.x + vp.screenWidthInWorldPixels,
          tlRaw.y + vp.screenHeightInWorldPixels
        );

        const tl = new Point(Math.floor(tlRaw.x / xScale), Math.floor(tlRaw.y / yScale));
        const br = new Point(Math.ceil(brRaw.x / xScale), Math.ceil(brRaw.y / yScale));

        onMove({ tl: tlRaw, br: brRaw }, { tl, br });
      },
      [xScale, yScale, onMove]
    );

    //? Изменяет положение Viewport при скейлинге
    useEffect(() => {
      const vp = vpRef.current;
      if (!vp || !xScale || !yScale || !xScalePrev || !yScalePrev) return;

      const rawCenter = new Point(
        -vp.position.x + vp.screenWidthInWorldPixels / 2,
        -vp.position.y + vp.screenHeightInWorldPixels / 2
      );

      const center = new Point(
        (rawCenter.x * xScale) / xScalePrev,
        (rawCenter.y * yScale) / yScalePrev
      );

      vp.moveCenter(center);
    }, [vpRef, xScale, yScale, xScalePrev, yScalePrev]);

    //? Изменяет положение Viewport при смене координат
    useEffect(() => {
      const vp = vpRef.current;
      if (!vp || p.currentlyMoving || (!p.xPos && !p.yPos)) return;
      if (p.xPos && p.yPos) vp.moveCorner(p.xPos, p.yPos);
      else if (p.xPos && !p.yPos) vp.moveCorner(p.xPos, vp.position.y);
      else if (!p.xPos && p.yPos) vp.moveCorner(vp.position.x, p.yPos);
    }, [vpRef, p.xPos, p.yPos, p.currentlyMoving]);

    //? Отслеживает изменения окна приложения
    useEffect(() => {
      const vp = vpRef.current;
      if (!vp) return;
      app.renderer.resize(p.width, p.height);
      vp.resize(p.width, p.height);
      onMoveHandler(vp);
    }, [app, p.width, p.height, onMoveHandler]);

    //? Применяет ограничения Viewport
    useEffect(() => {
      const vp = vpRef.current;
      if (!vp || !p.clampOptions) return;
      vp.clamp({
        top:
          p.clampOptions?.yFrom !== undefined
            ? p.clampOptions?.yFrom * yScale - vp.screenHeightInWorldPixels
            : null,
        left:
          p.clampOptions?.xFrom !== undefined
            ? p.clampOptions?.xFrom * xScale - vp.screenWidthInWorldPixels
            : null,
        bottom: p.clampOptions?.yTo ? p.clampOptions?.yTo * yScale : null,
        right: p.clampOptions?.xTo ? p.clampOptions?.xTo * xScale : null,
        underflow: 'center'
      });
    }, [vpRef, p.clampOptions, xScale, yScale]);

    //? Вкл/Выкл перемещение
    useEffect(() => {
      const vp = vpRef.current;
      if (!vp) return;
      vp.drag({ direction: p.dragEnabled ? p.dragDirection ?? 'all' : 'none' });
    }, [vpRef, p.dragEnabled, p.dragDirection]);

    //? Выключает масштабирование (используется скейл)
    useEffect(() => {
      if (!vpRef.current) return;
      vpRef.current.wheel().clampZoom({ minScale: 1, maxScale: 1 });
    }, [vpRef]);

    //? Прослушивает события Viewport
    useEffect(() => {
      const vp = vpRef.current;
      if (!vp) return;

      const moved = p.currentlyMoving ? () => onMoveHandler(vp) : undefined;
      const dragStart = () => (vp.interactiveChildren = false);
      const dragEnd = () => (vp.interactiveChildren = true);

      if (moved) vp.addListener('moved', moved);
      if (dragStart) vp.addListener('drag-start', dragStart);
      if (dragEnd) vp.addListener('drag-end', dragEnd);

      return () => {
        if (moved) vp.removeListener('moved', moved);
        if (dragStart) vp.removeListener('drag-start', dragStart);
        if (dragEnd) vp.removeListener('drag-end', dragEnd);
      };
    }, [vpRef, p.currentlyMoving, onMoveHandler]);

    return (
      <ViewportComponent ref={vpRef} app={app}>
        {p.children}
      </ViewportComponent>
    );
  }
);

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

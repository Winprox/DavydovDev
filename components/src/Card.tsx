import { VariantProps, cva } from 'class-variance-authority';
import { FC, HTMLAttributes, MouseEvent, useCallback, useRef } from 'react';
import { cm } from '.';

type CVAProps = VariantProps<typeof variants>;
const variants = cva(
  'relative h-full w-full overflow-hidden rounded-3xl transition-all duration-[75ms]',
  {
    defaultVariants: { theme: 'light' },
    variants: {
      theme: {
        dark: 'shadow-aCardWhite bg-aTextBlack text-aTextWhite',
        light: 'shadow-aCard bg-white text-aTextBlack'
      }
    }
  }
);

type Props = {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  glow?: boolean;
  rotateFactor?: number;
} & CVAProps;

export type TCard = Omit<HTMLAttributes<HTMLDivElement>, keyof Props> & Props;
export const Card: FC<TCard> = ({
  className,
  theme,
  children,
  wrapperProps,
  glow = true,
  rotateFactor = 2,
  onMouseMove,
  onMouseLeave,
  ...p
}) => {
  const boundsRef = useRef<DOMRect>();
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const rotateToMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      boundsRef.current = cardRef.current.getBoundingClientRect();
      const center = {
        x: e.clientX - boundsRef.current.x - boundsRef.current.width / 2,
        y: e.clientY - boundsRef.current.y - boundsRef.current.height / 2
      };

      if (rotateFactor !== 0) {
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
        cardRef.current.style.transform = `rotate3d(${center.y / 100}, 
        ${-center.x / 100}, 0, ${Math.log(distance) * rotateFactor}deg)`;
      }

      if (!glowRef.current || !glow) return;
      glowRef.current.style.background = `radial-gradient(circle at
      ${center.x + boundsRef.current.width / 2}px
      ${center.y + boundsRef.current.height / 2}px,
      rgba(${theme === 'dark' ? '255, 255, 255, 0.05' : '256, 0, 256, 0.075'}),
      transparent, transparent)`;

      onMouseMove?.(e);
    },
    [theme, glow, rotateFactor, onMouseMove]
  );

  const revertState = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = '';
      if (!glowRef.current) return;
      glowRef.current.style.background = 'transparent';

      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  return (
    <div
      {...wrapperProps}
      style={{ perspective: '1500px', ...wrapperProps?.style }}
      className={cm('w-min', wrapperProps?.className)}
    >
      <div
        {...p}
        ref={cardRef}
        className={cm(variants({ className, theme }))}
        onMouseMove={rotateToMouse}
        onMouseLeave={revertState}
      >
        {children}
        {glow && <div ref={glowRef} className='absolute left-0 top-0 h-full w-full' />}
      </div>
    </div>
  );
};

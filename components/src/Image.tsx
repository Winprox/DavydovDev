import { VariantProps, cva } from 'class-variance-authority';
import { FC, HTMLAttributes, ImgHTMLAttributes, useEffect, useState } from 'react';
import { Shimmer, cm, loadImage } from '.';

type CVAProps = VariantProps<typeof variants>;
const variants = cva(
  'flex items-center justify-center relative overflow-hidden select-none transition-all',
  {
    defaultVariants: { variant: undefined, shadowVariant: undefined },
    variants: {
      variant: { rounded: 'rounded-3xl', circle: 'rounded-full aspect-square' },
      shadowVariant: { light: 'shadow-aCard', dark: 'shadow-aCardWhite' },
    },
  }
);

type Props = {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  titleProps?: HTMLAttributes<HTMLParagraphElement>;
  imageClassName?: string;
  theme?: 'dark' | 'light' | null;
  shadow?: boolean;
  blurred?: boolean;
  title?: string;
  onLoad?: () => void;
} & CVAProps;

export type TImage = Omit<ImgHTMLAttributes<HTMLImageElement>, keyof Props> & Props;
export const Image: FC<TImage> = ({
  wrapperProps,
  titleProps,
  className,
  imageClassName,
  theme,
  shadow,
  blurred,
  variant,
  title,
  onLoad,
  ...p
}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!p.src || loaded) return;
    loadImage(p.src).then(() => {
      setLoaded(true);
      onLoad?.();
    });
  }, [p.src, loaded, onLoad]);

  return (
    <div
      {...wrapperProps}
      className={cm(
        variants({ className, variant, shadowVariant: shadow ? theme : undefined }),
        wrapperProps?.className
      )}
    >
      {p.src && loaded && blurred && (
        <div
          className={cm(
            'absolute h-full w-full animate-aFadeInSlow backdrop-blur-sm',
            variant === 'circle' && 'aspect-square rounded-full',
            variant === 'rounded' && 'rounded-3xl'
          )}
        />
      )}
      {p.src && loaded && (
        <img
          {...p}
          draggable={false}
          className={cm(
            'h-full w-full animate-aFadeIn object-cover transition-all',
            variant === 'circle' && 'aspect-square rounded-full',
            variant === 'rounded' && 'rounded-3xl',
            imageClassName
          )}
        />
      )}
      {loaded && title && (
        <p
          {...titleProps}
          className={cm(
            'absolute animate-aFadeInSlow p-2 text-center text-aPrimary',
            titleProps?.className
          )}
        >
          {title}
        </p>
      )}
      {(!p.src || p.src === '' || !loaded) && (
        <Shimmer
          className={cm(
            'h-full w-full',
            variant === 'circle' && 'aspect-square rounded-full',
            variant === 'rounded' && 'rounded-3xl'
          )}
          theme={theme}
        />
      )}
    </div>
  );
};

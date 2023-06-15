import { VariantProps, cva } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';
import { cm } from '.';

type CVAProps = VariantProps<typeof variants>;
const variants = cva('h-full animate-aShimmer', {
  defaultVariants: { theme: 'light' },
  variants: { theme: { dark: 'bg-aShimmer', light: 'bg-aShimmerLight' } },
});

export type TShimmer = Omit<HTMLAttributes<HTMLDivElement>, keyof CVAProps> & CVAProps;
export const Shimmer: FC<TShimmer> = ({ className, theme, style, ...p }) => (
  <div
    {...p}
    className={cm(variants({ className, theme }))}
    style={{ backgroundSize: '400%', ...style }}
  />
);

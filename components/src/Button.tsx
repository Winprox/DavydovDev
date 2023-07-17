import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cm } from './_utils';

type CVAProps = VariantProps<typeof variants>;
const variants = cva(
  cm(`select-none transition-all cursor-pointer hover:scale-110 active:scale-90
      disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100`),
  {
    defaultVariants: { variant: 'default', theme: 'light' },
    variants: {
      theme: { dark: '', light: '' },
      variant: {
        default: cm(
          'flex justify-center items-center rounded-2xl px-6 py-2',
          'text-white bg-aPrimary bg-opacity-70',
          'shadow-aCardPrimary disabled:text-opacity-25'
        ),
        outline: cm(
          'rounded-lg px-3 py-1 bg-transparent border-2',
          'disabled:text-opacity-30 disabled:hover:text-opacity-30',
          'disabled:border-opacity-30 disabled:hover:border-opacity-30'
        ),
        circle: cm(
          'flex justify-center items-center rounded-full aspect-square p-1',
          'text-white bg-aTextBlack bg-opacity-20 backdrop-blur-md',
          'shadow-aCard disabled:text-opacity-25'
        ),
        circlePrimary: cm(
          'flex justify-center items-center rounded-full aspect-square p-1',
          'text-aTextWhite bg-aPrimary bg-opacity-70 backdrop-blur-sm',
          'shadow-aCardPrimary disabled:text-opacity-25'
        ),
        transparent: cm('rounded-none text-left disabled:text-opacity-25')
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        theme: 'light',
        class: cm(
          'text-aPrimary border-aPrimary',
          'hover:text-aPrimaryDark hover:border-aPrimaryDark',
          'disabled:hover:text-aPrimary disabled:hover:border-aPrimary'
        )
      },
      {
        variant: 'outline',
        theme: 'dark',
        class: cm(
          'text-aTextWhite border-aTextWhite',
          'hover:text-aPrimary hover:border-aPrimary',
          'disabled:hover:text-aTextWhite disabled:hover:border-aTextWhite'
        )
      },
      { variant: 'transparent', theme: 'light', class: 'text-aPrimary' },
      { variant: 'transparent', theme: 'dark', class: 'text-aTextWhite' }
    ]
  }
);

export type TButton = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CVAProps> &
  CVAProps & { href?: string };
export const Button = forwardRef<HTMLButtonElement, TButton>(
  ({ className, variant, theme, href, ...p }, ref) => {
    const button = (
      <button {...p} ref={ref} className={cm(variants({ className, variant, theme }))} />
    );
    if (!href) return button;
    return (
      <a tabIndex={-1} href={href} onClick={(e) => e.preventDefault()}>
        {button}
      </a>
    );
  }
);

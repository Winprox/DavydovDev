import { VariantProps, cva } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { cm } from '.';

type CVAProps = VariantProps<typeof variants>;
const variants = cva('fixed left-0 top-0 h-full w-full transition-all', {
  defaultVariants: { variant: 'default', theme: 'light', fadeIn: true },
  variants: {
    variant: { default: '', dim: 'backdrop-blur-sm filter' },
    theme: { light: '', dark: '' },
    fadeIn: { true: 'animate-aFadeIn', false: '' }
  },
  compoundVariants: [
    { variant: 'dim', theme: 'light', className: 'bg-black bg-opacity-5' },
    { variant: 'dim', theme: 'dark', className: 'bg-black bg-opacity-25' }
  ]
});

export type TBackdrop = Omit<HTMLAttributes<HTMLDivElement>, keyof CVAProps> & CVAProps;
const Backdrop: FC<TBackdrop> = ({ className, variant, theme, fadeIn, ...p }) => (
  <div {...p} className={cm(variants({ className, variant, theme, fadeIn }))} />
);

type Props = {
  fadeIn?: boolean;
  backdropProps?: TBackdrop;
  rootName?: string;
};
export type TModal = Omit<HTMLAttributes<HTMLDivElement>, keyof Props> & Props;
export const Modal: FC<TModal> = ({
  backdropProps,
  className,
  rootName,
  fadeIn = true,
  ...p
}) => {
  const modalComponent = (
    <Backdrop {...backdropProps} fadeIn={fadeIn ?? backdropProps?.fadeIn}>
      <div {...p} className={cm('fixed left-0 top-0', className)} />
    </Backdrop>
  );
  return rootName
    ? createPortal(modalComponent, document.getElementById(rootName)!)
    : modalComponent;
};

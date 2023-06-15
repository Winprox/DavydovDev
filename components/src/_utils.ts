import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cm = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const loadImage = (
  src: string | string[]
): Promise<HTMLImageElement | HTMLImageElement[]> =>
  new Promise((res, rej) => {
    if (!Array.isArray(src)) {
      const i = new Image();
      i.src = src;
      i.onload = () => res(i);
      i.onerror = (e) => rej(e);
    } else {
      const arr = src.map(
        (src) =>
          new Promise((res, rej) => {
            const i = new Image();
            i.src = src;
            i.onload = () => res(i);
            i.onerror = (err) => rej(err);
          }) as Promise<HTMLImageElement>
      );
      Promise.all(arr)
        .then((images) => res(images))
        .catch((e) => rej(e));
    }
  });

export const openNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

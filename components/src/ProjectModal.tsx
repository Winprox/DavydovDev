import { InternalCarouselProps } from 'nuka-carousel';
import { FC, ReactNode, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { Button, Card, Carousel, Image, MarkDown, Modal, Shimmer, TImage, TModal, TStackItem, cm, openNewTab } from '.'; // prettier-ignore

export type TCarousel = Partial<InternalCarouselProps>;

export type TProjectModal = {
  theme?: 'dark' | 'light';
  title?: string;
  desc?: string;
  images?: string[];
  footer?: string;
  actions?: ReactNode;
  stack?: TStackItem[];
  modalProps?: TModal;
  carouselProps?: Partial<InternalCarouselProps>;
  imageProps?: TImage;
  onClose?: () => void;
};

export const ProjectModal: FC<TProjectModal> = ({ onClose, ...p }) => {
  const [about, setAbout] = useState('');
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    if (!p.desc) return;
    fetch(p.desc)
      .then((r) => r.text())
      .then((t) => setAbout(t));
  }, [p.desc]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  return (
    <Modal
      {...p.modalProps}
      backdropProps={{
        ...p.modalProps?.backdropProps,
        theme: p.modalProps?.backdropProps?.theme ?? p.theme,
        variant: p.modalProps?.backdropProps?.variant ?? 'dim',
        className: cm('animate-aFadeIn', p.modalProps?.backdropProps?.className),
      }}
      className={cm(
        'flex h-full w-full animate-aFadeIn items-center justify-center',
        p.modalProps?.className
      )}
      onClick={onClose}
    >
      <Card
        glow={false}
        rotateFactor={0}
        theme={p.theme}
        className='relative flex flex-col rounded-none sm:rounded-3xl'
        wrapperProps={{
          className: cm(
            'h-full w-full mx-0 transition-all',
            'sm:h-3/4 sm:mx-10 sm:max-w-screen-md',
            'smallHeight:h-full smallHeight:py-2'
          ),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant='circle'
          className='absolute right-0 z-50 m-2 h-14 w-14 shadow-lg sm:m-4 sm:shadow-aCard'
          onClick={onClose}
        >
          <MdClose size={34} />
        </Button>
        <div className='relative flex h-full cursor-default flex-col justify-between overflow-y-auto overflow-x-hidden'>
          <div>
            {p.images && (
              <div
                className={cm(
                  p.theme === 'dark' && 'shadow-aCardWhite',
                  p.theme !== 'dark' && 'shadow-aCard'
                )}
              >
                <Carousel wrapAround {...p.carouselProps}>
                  {p.images?.map((v, i) => (
                    <Image
                      {...p.imageProps}
                      key={i}
                      src={v}
                      theme={p.theme}
                      className={cm(
                        'pointer-events-none select-none',
                        p.imageProps?.className
                      )}
                      wrapperProps={{
                        ...p.imageProps?.wrapperProps,
                        className: cm(
                          'h-full',
                          (p.carouselProps?.slidesToShow ?? 1) > 1 && 'px-1',
                          p.imageProps?.wrapperProps?.className
                        ),
                      }}
                      onLoad={() => {
                        setShimmer(false);
                        p.imageProps?.onLoad?.();
                      }}
                    />
                  ))}
                </Carousel>
              </div>
            )}
            <div className='p-4'>
              {p.title && <h2 className='cursor-default pb-3 text-lg font-bold'>{p.title}</h2>}
              {<MarkDown theme={p.theme}>{about}</MarkDown>}
            </div>
          </div>
          <div>
            {p.footer && (
              <div className='flex justify-center whitespace-pre-wrap pb-4'>{p.footer}</div>
            )}
            {p.actions && (
              <div className='flex flex-col items-center gap-2 pb-6 pt-2'>{p.actions}</div>
            )}
            {p.stack && (
              <div
                className={cm(
                  'flex flex-wrap justify-center gap-2 px-4 pb-10 pt-2 transition-all sm:hidden'
                )}
              >
                {p.stack?.map((i) => (
                  <Button
                    key={i.url}
                    theme={p.theme}
                    variant='transparent'
                    className={p.theme === 'dark' ? undefined : 'text-aTextBlack'}
                    onClick={() => openNewTab(i.url)}
                  >
                    {i.icon}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        {p.stack && (
          <div
            className={cm(
              'hidden flex-wrap justify-center gap-2 px-4 pb-6 pt-2 transition-all sm:flex'
            )}
          >
            {p.stack?.map((i) => (
              <Button
                key={i.url}
                href={i.url}
                tabIndex={-1}
                theme={p.theme}
                variant='transparent'
                className={p.theme === 'dark' ? undefined : 'text-aTextBlack'}
                onClick={() => openNewTab(i.url)}
              >
                {i.icon}
              </Button>
            ))}
          </div>
        )}
        {shimmer && (
          <div
            className={cm(
              'absolute h-full w-full',
              p.theme === 'dark' && 'bg-aTextBlack',
              p.theme !== 'dark' && 'bg-white'
            )}
          >
            <Shimmer theme={p.theme} className='h-full w-full' />
          </div>
        )}
      </Card>
    </Modal>
  );
};

import NCarousel, { InternalCarouselProps } from 'nuka-carousel';
import { FC, useMemo, useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Button, cm } from '.';
import './Carousel.css';

export const Carousel: FC<Partial<InternalCarouselProps>> = (p) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const twoSlidesPerView = useMemo(() => p.slidesToShow === 2, [p.slidesToShow]);
  const fit = useMemo(() => {
    return Array.isArray(p.children) && p.children.length <= (p.slidesToShow ?? 1);
  }, [p.children, p.slidesToShow]);

  return (
    <div
      className={cm('h-full', twoSlidesPerView && 'px-4 sm:px-12')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <NCarousel
        ref={carouselRef}
        dragging={!fit}
        renderCenterLeftControls={({ previousSlide, previousDisabled }) =>
          !fit &&
          hover && (
            <Button
              variant='circle'
              className={cm(
                !twoSlidesPerView && 'ml-4 sm:ml-12',
                'h-14 animate-aFadeInScale text-white disabled:text-white sm:flex',
                'disabled:cursor-pointer disabled:opacity-0 hover:disabled:opacity-0'
              )}
              onClick={previousSlide}
              disabled={previousDisabled}
            >
              <IoIosArrowBack size={34} />
            </Button>
          )
        }
        renderCenterRightControls={({ nextSlide, nextDisabled }) =>
          !fit &&
          hover && (
            <Button
              variant='circle'
              className={cm(
                !twoSlidesPerView && 'mr-4 sm:mr-12',
                'h-14 animate-aFadeInScale text-white disabled:text-white sm:flex',
                'disabled:cursor-pointer disabled:opacity-0 hover:disabled:opacity-0'
              )}
              onClick={nextSlide}
              disabled={nextDisabled}
            >
              <IoIosArrowForward size={34} />
            </Button>
          )
        }
        renderBottomCenterControls={({ slideCount, currentSlide, goToSlide }) =>
          !fit && (
            <ul className='mb-2 flex items-center gap-1'>
              {Array.from(
                { length: twoSlidesPerView && !p.wrapAround ? slideCount - 1 : slideCount },
                (_, k) => (
                  <li className={currentSlide == k ? 'active' : undefined} key={k}>
                    <Button
                      variant='circle'
                      onClick={() => goToSlide(k)}
                      className={cm(
                        'h-4 w-4 border-2 border-white border-opacity-10',
                        currentSlide === k && 'opacity-60'
                      )}
                    >
                      <div
                        className={cm(
                          'aspect-square h-2 w-2 scale-0 rounded-full bg-white transition-all',
                          currentSlide === k && 'scale-100'
                        )}
                      />
                    </Button>
                  </li>
                )
              )}
            </ul>
          )
        }
        {...p}
      />
    </div>
  );
};

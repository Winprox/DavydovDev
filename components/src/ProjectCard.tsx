import { FC } from 'react';
import { Card, Image, MarkDown, TCard, TStackItem, cm } from '.';

type Props = { image: string; title?: string; desc?: string; stack?: TStackItem[] };
export type TProjectCard = Omit<TCard, keyof Props> & Props;
export const ProjectCard: FC<TProjectCard> = ({
  title,
  image,
  desc,
  stack,
  className,
  theme,
  ...p
}) => (
  <Card
    {...p}
    theme={theme}
    className={cm(
      'relative flex aspect-3/4 h-[25rem] select-none flex-col',
      'sm:hover:shadow-aCardPrimary sm:active:shadow-aCardPrimaryActive',
      className
    )}
  >
    <Image shadow className='h-[40%]' theme={theme} src={image} />
    <div className='flex-1 overflow-hidden p-3'>
      {title && (
        <MarkDown theme={theme} className='text-lg font-bold leading-6'>
          {title}
        </MarkDown>
      )}
      {desc && (
        <MarkDown theme={theme} className='pt-2 leading-5'>
          {desc}
        </MarkDown>
      )}
    </div>
    {stack && (
      <div className={cm('flex flex-wrap justify-center gap-2 px-6 pb-6 pt-4 transition-all')}>
        {stack?.map((i) => (
          <div key={i.url} className='z-50'>
            {i.icon}
          </div>
        ))}
      </div>
    )}
  </Card>
);

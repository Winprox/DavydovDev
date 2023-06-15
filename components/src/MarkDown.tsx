import { FC } from 'react';
import MD, { Options } from 'react-markdown';
import { cm } from '.';

export const MarkDown: FC<Options & { theme?: 'light' | 'dark' | null }> = ({
  theme = 'light',
  ...props
}) => (
  <MD
    {...props}
    components={{
      h1: ({ className, ...p }) => <h1 {...p} className={cm('pb-2 text-5xl', className)} />,
      h2: ({ className, ...p }) => <h1 {...p} className={cm('pb-2 text-4xl', className)} />,
      h3: ({ className, ...p }) => <h1 {...p} className={cm('pb-2 text-3xl', className)} />,
      h4: ({ className, ...p }) => <h1 {...p} className={cm('pb-2 text-2xl', className)} />,
      h5: ({ className, ...p }) => <h1 {...p} className={cm('pb-2 text-xl', className)} />,
      h6: ({ className, ...p }) => <h1 {...p} className={cm('pb-2 text-lg', className)} />,
      hr: ({ className, ...p }) => <hr {...p} className={cm('pt-4 opacity-0', className)} />,
      p: ({ className, ...p }) => (
        <p {...p} className={cm('whitespace-pre-wrap', className)} />
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ul: ({ className, ordered, ...p }) => <ul {...p} className={cm('mt-1', className)} />,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      li: ({ ordered, ...p }) => (
        <div className='flex items-start gap-2'>
          <div className='mt-2 aspect-square h-[0.33rem] rounded-full bg-aPrimary opacity-25' />
          <li {...p} />
        </div>
      ),
    }}
    className={cm(
      'cursor-default',
      theme === 'dark' && 'text-aTextWhite',
      theme !== 'dark' && 'text-aTextBlack',
      props.className
    )}
  />
);

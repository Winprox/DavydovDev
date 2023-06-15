import { ChangeEvent, FC } from 'react';

export const ConfigLine: FC<{
  title: string;
  disabled?: boolean;
  value: number | [number, number];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange2?: (e: ChangeEvent<HTMLInputElement>) => void;
}> = (p) => (
  <div className='flex justify-between gap-2'>
    <div>{`${p.title}:`}</div>
    {Array.isArray(p.value) && (
      <div className='flex items-center gap-2'>
        <input
          type='number'
          className='w-16 rounded-md border-[0.1rem] bg-transparent pl-2 leading-3 outline-none'
          value={p.value[0] ? p.value[0] : ''}
          disabled={p.disabled}
          onChange={p.onChange}
        />
        <div className='h-[0.05rem] w-2 bg-white' />
        <input
          type='number'
          className='w-16 rounded-md border-[0.1rem] bg-transparent pl-2 leading-3 outline-none'
          value={p.value[1] ? p.value[1] : ''}
          disabled={p.disabled}
          onChange={p.onChange2}
        />
      </div>
    )}
    {!Array.isArray(p.value) && (
      <input
        type='number'
        className='w-16 rounded-md border-[0.1rem] bg-transparent pl-2 leading-3 outline-none'
        value={p.value ? p.value : ''}
        disabled={p.disabled}
        onChange={p.onChange}
      />
    )}
  </div>
);

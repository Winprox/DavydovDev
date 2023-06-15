import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '.';

const meta = { title: 'Carousel', component: Carousel } satisfies Meta<typeof Carousel>;
export default meta;

type Story = StoryObj<typeof meta>;
export const carousel: Story = {
  render: (p) => (
    <div className='h-96 w-96'>
      <Carousel {...p}>
        <div className='h-full bg-red-700' />
        <div className='h-full bg-red-800' />
        <div className='h-full bg-red-900' />
      </Carousel>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '.';

const meta = { title: 'Image', component: Image } satisfies Meta<typeof Image>;
export default meta;

type Story = StoryObj<typeof meta>;
export const image: Story = {
  args: {
    className: 'w-36 h-36',
    imageClassName: 'object-cover',
    src: 'https://ru.reactjs.org/logo-og.png',
  },
};
export const imageBlurred: Story = {
  args: {
    title: 'React',
    titleProps: { className: 'text-aTextWhite' },
    blurred: true,
    className: 'w-36 h-36',
    imageClassName: 'object-cover',
    src: 'https://ru.reactjs.org/logo-og.png',
  },
};

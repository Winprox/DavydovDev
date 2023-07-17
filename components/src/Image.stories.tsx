import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '.';

const meta = { title: 'Image', component: Image } satisfies Meta<typeof Image>;
export default meta;

type Story = StoryObj<typeof meta>;
const args = {  className: 'w-36 h-36',  imageClassName: 'object-cover',  src: 'https://ru.reactjs.org/logo-og.png',}; // prettier-ignore
export const image: Story = { args };
export const imageBlurred: Story = {
  args: {
    title: 'React',
    titleProps: { className: 'text-aTextWhite' },
    blurred: true,
    ...args
  }
};

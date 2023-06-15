import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '.';

const meta = { title: 'Card', component: Card } satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof meta>;
export const dark: Story = { args: { children: '', className: 'w-80 h-80 m-10' } };
export const light: Story = {
  args: { children: '', className: 'w-80 h-80 m-10', theme: 'light' },
};

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '.';

const meta = { title: 'Card', component: Card } satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof meta>;
const args = { children: '', className: 'w-80 h-80 m-10' };
export const dark: Story = { args };
export const light: Story = { args: { theme: 'light', ...args } };

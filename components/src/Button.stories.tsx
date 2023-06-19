import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '.';

const meta = { title: 'Button', component: Button } satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: 'Default' },
};
export const DefaultDisabled: Story = {
  args: { disabled: true, children: 'Default' },
};
export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
};
export const OutlineDark: Story = {
  args: { children: 'Outline', variant: 'outline', theme: 'dark' },
};
export const OutlineDisabled: Story = {
  args: { disabled: true, children: 'Outline', variant: 'outline' },
};
export const OutlineDisabledDark: Story = {
  args: { disabled: true, children: 'Outline', variant: 'outline', theme: 'dark' },
};
export const Transparent: Story = {
  args: { children: 'X', variant: 'transparent' },
};
export const TransparentDark: Story = {
  args: { children: 'X', variant: 'transparent', theme: 'dark' },
};
export const TransparentDisabled: Story = {
  args: { disabled: true, children: 'X', variant: 'transparent' },
};
export const TransparentDisabledDark: Story = {
  args: { disabled: true, children: 'X', variant: 'transparent', theme: 'dark' },
};
export const Circle: Story = {
  args: { children: 'X', variant: 'circle', className: 'w-10 h-10' },
};
export const CircleDisabled: Story = {
  args: { disabled: true, children: 'X', variant: 'circle', className: 'w-10 h-10' },
};
export const CirclePrimary: Story = {
  args: { children: 'X', variant: 'circlePrimary', className: 'w-10 h-10' },
};
export const CirclePrimaryDisabled: Story = {
  args: { disabled: true, children: 'X', variant: 'circlePrimary', className: 'w-10 h-10' },
};

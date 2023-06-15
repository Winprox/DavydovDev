import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from '.';

const meta = { title: 'ProjectCard', component: ProjectCard } satisfies Meta<
  typeof ProjectCard
>;
export default meta;

const image = 'https://ru.reactjs.org/logo-og.png';
type Story = StoryObj<typeof meta>;
export const dark: Story = {
  args: {
    theme: 'dark',
    title: 'Title',
    desc: 'Desc',
    stack: [],
    className: 'select-none',
    image,
  },
};
export const light: Story = {
  args: {
    title: 'Title',
    desc: 'Desc',
    stack: [],
    className: 'select-none',
    image,
  },
};

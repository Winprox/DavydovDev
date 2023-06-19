import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard, Stack, TStackItem } from '.';

const meta = { title: 'ProjectCard', component: ProjectCard } satisfies Meta<
  typeof ProjectCard
>;
export default meta;

const image = 'https://ru.reactjs.org/logo-og.png';
const stack: TStackItem[] = Array.from({ length: 6 }).map(
  () =>
    Stack[
      Object.keys(Stack).at(
        Math.floor(Math.random() * Object.keys(Stack).length)
      )! as keyof typeof Stack
    ]
);

type Story = StoryObj<typeof meta>;
const args = { title: 'Title', desc: 'Desc', stack, image };
export const light: Story = { args };
export const dark: Story = { args: { theme: 'dark', ...args } };

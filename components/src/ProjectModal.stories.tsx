import type { Meta, StoryObj } from '@storybook/react';
import { ProjectModal, Stack, TStackItem } from '.';

const meta = { title: 'ProjectModal', component: ProjectModal } satisfies Meta<
  typeof ProjectModal
>;
export default meta;

const images = ['https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png', ''];
const desc = 'testRoute';

const stack: TStackItem[] = Array.from({ length: 10 }).map(
  () =>
    Stack[
      Object.keys(Stack).at(
        Math.floor(Math.random() * Object.keys(Stack).length)
      )! as keyof typeof Stack
    ]
);

type Story = StoryObj<typeof meta>;
const args = { title: 'Title', desc, images, stack };
export const Light: Story = { args };
export const Dark: Story = { args: { theme: 'dark', ...args } };

import type { Meta, StoryObj } from '@storybook/react';
import { ProjectModal, Stack, TStackItem } from '.';

const meta = { title: 'ProjectModal', component: ProjectModal } satisfies Meta<
  typeof ProjectModal
>;
export default meta;

const img = 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png';
const desc = 'testRoute';

const stack: TStackItem[] = [
  Stack.pnpm,
  Stack.vite,
  Stack.react,
  Stack.typescript,
  Stack.tailwind,
  Stack.zustand,
  Stack.postcss,
  Stack.autoprefixer,
  Stack.eslint,
  Stack.prettier,
  Stack.storybook,
  Stack.markdown,
  Stack.node,
  Stack.tsnode,
];

type Story = StoryObj<typeof meta>;
export const Dark: Story = {
  args: { theme: 'dark', title: 'Lorem ipsum', desc, images: [img, ''], stack },
};
export const Light: Story = {
  args: { title: 'Lorem ipsum', desc, images: [img, ''], stack },
};

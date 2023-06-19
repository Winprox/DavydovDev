import type { Meta, StoryObj } from '@storybook/react';
import { FC } from 'react';
import { Card, Shimmer, TShimmer } from '.';

const meta = { title: 'Shimmer', component: Shimmer } satisfies Meta<typeof Shimmer>;
export default meta;

const Component: FC<TShimmer> = (p) => (
  <Card className={`h-40 w-40 ${p.theme === 'dark' ? 'bg-aTextBlack' : 'bg-white'}`}>
    <Shimmer {...p} />
  </Card>
);

type Story = StoryObj<typeof meta>;
export const Light: Story = { render: (p) => <Component {...p} /> };
export const Dark: Story = { render: (p) => <Component {...p} />, args: { theme: 'dark' } };

import type { Meta, StoryObj } from '@storybook/react';
import { MarkDown } from '.';

const meta = { title: 'MarkDown', component: MarkDown } satisfies Meta<typeof MarkDown>;
export default meta;

type Story = StoryObj<typeof meta>;
export const markDown: Story = { args: { children: '# *HELLO*', className: 'text-aPrimary' } };

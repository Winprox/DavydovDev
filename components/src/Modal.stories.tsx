import type { Meta, StoryObj } from '@storybook/react';
import { FC } from 'react';
import { Button, Modal, TModal } from '.';

const meta = { title: 'Modal', component: Modal } satisfies Meta<typeof Modal>;
export default meta;

const Component: FC<TModal> = (p) => (
  <>
    <Button>Button</Button>
    <Modal {...p} />
  </>
);

const ModalChild: FC = () => (
  <div className='select-none text-aPrimary'>Text Inside Modal</div>
);

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: (p) => <Component {...p} />,
  args: {
    className: 'w-full h-full flex items-center justify-center',
    children: <ModalChild />,
  },
};
export const Dim: Story = {
  render: (p) => <Component {...p} />,
  args: {
    className: 'w-full h-full flex items-center justify-center',
    children: <ModalChild />,
    backdropProps: { variant: 'dim' },
  },
};

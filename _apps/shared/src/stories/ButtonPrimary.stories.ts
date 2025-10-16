import { ButtonPrimary } from '@/components/button/ButtonPrimary';
import { colors } from '@/styles/colors';
import { fontSize } from '@/styles/fontSize';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/internal/test';

const meta = {
  title: 'COMMON/ButtonPrimary',
  component: ButtonPrimary,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      description: '버튼의 크기',
    },
    fontSize: {
      control: 'radio',
      description: '글자의 크기',

      options: [...Object.keys(fontSize)],
    },
    children: { control: 'text', description: '버튼의 이름' },
    isTruncate: { control: 'boolean', description: '버튼명 말줄임표' },
    variant: {
      control: 'radio',
      description: '버튼의 배경색상',
      options: ['default', ...Object.keys(colors)],
    },
    onClick: { description: '버튼의 동작함수' },
  },

  args: {
    size: 'default',
    fontSize: 'base',
    variant: 'default',
    children: '버튼명',
    isTruncate: false,
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DEFAULT: Story = {
  args: {
    size: 'default',
    fontSize: 'base',
    variant: 'default',
    children: '버튼명',
    isTruncate: false,
    onClick: fn(),
  },
};

export const variant: Story = {
  args: {
    size: 'default',
    fontSize: 'base',
    variant: 'primary',
    children: '버튼명',
    isTruncate: false,
    onClick: fn(),
  },
};

export const B_SIZE_SM_ACTIVE_TRUNCATE: Story = {
  args: {
    size: 'sm',
    fontSize: 'base',
    variant: 'secondary',
    children: '버튼의 말줄임표가 활성화',
    isTruncate: true,
    onClick: fn(),
  },
};

export const B_SIZE_SM: Story = {
  args: {
    size: 'sm',
    fontSize: 'base',
    variant: 'secondary',
    children: '버튼',
    isTruncate: false,
    onClick: fn(),
  },
};

export const B_SIZE_LG: Story = {
  args: {
    size: 'lg',
    fontSize: 'base',
    variant: 'secondary',
    children: '버튼',
    isTruncate: false,
    onClick: fn(),
  },
};

export const B_SIZE_XL: Story = {
  args: {
    size: 'xl',
    fontSize: 'base',
    variant: 'secondary',
    children: '버튼',
    isTruncate: false,
    onClick: fn(),
  },
};

export const B_FONTSIZE_XS: Story = {
  args: {
    size: 'default',
    fontSize: 'xs',
    variant: 'default',
    children: '버튼의 글자크기가 12px',
    isTruncate: true,
    onClick: fn(),
  },
};

export const B_FONTSIZE_SM: Story = {
  args: {
    size: 'default',
    fontSize: 'sm',
    variant: 'default',
    children: '버튼의 글자크기가 14px',
    isTruncate: true,
    onClick: fn(),
  },
};

export const B_FONTSIZE_DEFAULT: Story = {
  args: {
    size: 'default',
    fontSize: 'base',
    variant: 'default',
    children: '버튼의 글자크기가 16px',
    isTruncate: true,
    onClick: fn(),
  },
};

export const B_FONTSIZE_XL: Story = {
  args: {
    size: 'default',
    fontSize: 'xl',
    variant: 'default',
    children: '버튼의 글자크기가 20px',
    isTruncate: true,
    onClick: fn(),
  },
};

export const B_FONTSIZE_2XL: Story = {
  args: {
    size: 'default',
    fontSize: '2xl',
    variant: 'default',
    children: '버튼의 글자크기가 24px',
    isTruncate: true,
    onClick: fn(),
  },
};

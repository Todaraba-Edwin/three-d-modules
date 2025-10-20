import { ButtonPrimary } from '@/components';
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
      control: 'select',
      description: '버튼의 크기',
    },
    fontSize: {
      control: 'select',
      description: '글자의 크기',

      options: [...Object.keys(fontSize)].filter(list => list != 'xs-weight'),
    },

    isTruncate: { control: 'boolean', description: '버튼명 말줄임표' },
    variant: {
      control: 'select',
      description: '버튼의 배경색상',
      options: [
        'default',
        'none',
        ...Object.keys(colors).filter(
          list => !['active', 'un_active'].includes(list)
        ),
      ],
    },
    children: { control: 'text', description: '버튼의 이름' },
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

const stories = {
  DEFAULT: {
    args: {
      size: 'default',
      fontSize: 'base',
      variant: 'default',
      children: '버튼명',
      isTruncate: false,
      onClick: fn(),
    },
  },
  VARIANT: {
    args: {
      size: 'default',
      fontSize: 'base',
      variant: 'primary',
      children: '버튼명',
      isTruncate: false,
      onClick: fn(),
    },
  },
  B_SIZE_SM_ACTIVE_TRUNCATE: {
    args: {
      size: 'sm',
      fontSize: 'base',
      variant: 'secondary',
      children: '버튼의 말줄임표가 활성화',
      isTruncate: true,
      onClick: fn(),
    },
  },
  B_SIZE_SM: {
    args: {
      size: 'sm',
      fontSize: 'base',
      variant: 'secondary',
      children: '버튼',
      isTruncate: false,
      onClick: fn(),
    },
  },
  B_SIZE_LG: {
    args: {
      size: 'lg',
      fontSize: 'base',
      variant: 'secondary',
      children: '버튼',
      isTruncate: false,
      onClick: fn(),
    },
  },
  B_SIZE_XL: {
    args: {
      size: 'xl',
      fontSize: 'base',
      variant: 'secondary',
      children: '버튼',
      isTruncate: false,
      onClick: fn(),
    },
  },
  B_FONTSIZE_XS: {
    args: {
      size: 'default',
      fontSize: 'xs',
      variant: 'default',
      children: '버튼의 글자크기가 12px',
      isTruncate: true,
      onClick: fn(),
    },
  },
  B_FONTSIZE_SM: {
    args: {
      size: 'default',
      fontSize: 'sm',
      variant: 'default',
      children: '버튼의 글자크기가 14px',
      isTruncate: true,
      onClick: fn(),
    },
  },
  B_FONTSIZE_DEFAULT: {
    args: {
      size: 'default',
      fontSize: 'base',
      variant: 'default',
      children: '버튼의 글자크기가 16px',
      isTruncate: true,
      onClick: fn(),
    },
  },
  B_FONTSIZE_XL: {
    args: {
      size: 'default',
      fontSize: 'xl',
      variant: 'default',
      children: '버튼의 글자크기가 20px',
      isTruncate: true,
      onClick: fn(),
    },
  },
  B_FONTSIZE_2XL: {
    args: {
      size: 'default',
      fontSize: '2xl',
      variant: 'default',
      children: '버튼의 글자크기가 24px',
      isTruncate: true,
      onClick: fn(),
    },
  },
} satisfies Record<string, Story>;

export const DEFAULT = stories.DEFAULT;
export const VARIANT = stories.VARIANT;
export const B_SIZE_SM_ACTIVE_TRUNCATE = stories.B_SIZE_SM_ACTIVE_TRUNCATE;
export const B_SIZE_SM = stories.B_SIZE_SM;
export const B_SIZE_LG = stories.B_SIZE_LG;
export const B_SIZE_XL = stories.B_SIZE_XL;
export const B_FONTSIZE_XS = stories.B_FONTSIZE_XS;
export const B_FONTSIZE_SM = stories.B_FONTSIZE_SM;
export const B_FONTSIZE_DEFAULT = stories.B_FONTSIZE_DEFAULT;
export const B_FONTSIZE_XL = stories.B_FONTSIZE_XL;
export const B_FONTSIZE_2XL = stories.B_FONTSIZE_2XL;

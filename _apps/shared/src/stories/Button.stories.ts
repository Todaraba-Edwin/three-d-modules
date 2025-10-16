import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/internal/test';
import { Button } from '../components/button/Button';

const meta = {
  title: 'COMMON/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
  argTypes: {
    onClick: { description: '버튼의 동작함수' },
    primary: { control: 'boolean', description: '버튼의 타입(기본형)' },
    backgroundColor: { control: 'color', description: '버튼의 배경색상' },
    label: {
      control: 'text',
      description: '버튼의 명칭',
    },
    size: {
      control: 'radio',
      description: '버튼의 크기설정',
      options: ['작게', '중간', '크게'],
      mapping: {
        작게: 'small',
        보통: 'medium',
        크게: 'large',
      },
    },
  },

  args: {
    // onClick: () => {
    //   console.log('버튼 동작');
    // },
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

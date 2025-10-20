import { FormInputField } from '@/components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { HTMLInputTypeAttribute } from 'react';

const meta = {
  title: 'COMMON/FormInputField',
  component: FormInputField,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      description: 'INPUT의 타입설정',
      options: [
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
        'month',
        'week',
        'color',
      ] as HTMLInputTypeAttribute[],
    },
    isSuccess: {
      control: 'boolean',
      description: '유효성검사 통과시에 대한 진위값',
    },
    isError: {
      control: 'boolean',
      description: '유효성검사 실패시에 대한 진위값',
    },
  },
  args: {
    type: 'text',

    isSuccess: false,
    isError: false,
  },
} satisfies Meta<typeof FormInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

const stories = {
  DEFAULT: {
    args: {
      label: '라벨',
      type: 'text',
      placeholder: '입력을 해주세요.',
      messages: {
        success: '성공시 문구를 입력해주세요.',
        error: '실패시 문구를 입력해주세요.',
      },
    },
  },
  PASSWORD: {
    args: {
      label: '비밀번호',
      type: 'password',
      value: '1234',
      placeholder: '비밀번호를 입력해주세요.',
      messages: {
        success: '사용이 가능한 비밀번호 입니다.',
        error: '사용이 불가한 비밀번호 입니다.',
      },
    },
  },
  SUCCESS: {
    args: {
      label: '아이디',
      type: 'text',
      placeholder: '아이디를 해주세요.',
      value: 'testID',
      isSuccess: true,
      messages: {
        success: '사용 가능한 ID 입니다.',
        error: '실패시 문구를 입력해주세요.',
      },
    },
  },
  ERROR: {
    args: {
      label: '아이디',
      type: 'text',
      placeholder: '아이디를 해주세요.',
      value: 'testID',
      isError: true,
      messages: {
        success: '사용 가능한 ID 입니다.',
        error: '중복된 ID 입니다.',
      },
    },
  },
} satisfies Record<string, Story>;

export const DEFAULT = stories.DEFAULT;
export const PASSWORD = stories.PASSWORD;
export const SUCCESS = stories.SUCCESS;
export const ERROR = stories.ERROR;

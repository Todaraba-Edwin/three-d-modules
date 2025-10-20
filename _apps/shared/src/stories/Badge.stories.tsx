import { Badge, BADGE_ENUM, USER_ENUM } from '@/components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheckBig, Star } from 'lucide-react';

const icons = {
  None: null,
  CircleCheckBig: <CircleCheckBig className='h-badge-icon w-badge-icon' />,
  Star: <Star className='h-badge-icon w-badge-icon' />,
};

const meta = {
  title: 'COMMON/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
  argTypes: {
    isMaxLength: {
      control: 'boolean',
      description: '뱃지의 길이제한 설정(80px)',
    },

    badgeCode: {
      control: 'select',
      description: '뱃지타입',
      options: Object.keys({ ...USER_ENUM, ...BADGE_ENUM }),
    },
    addIcon: {
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
      },
      description: '뱃지에 표시할 Lucide 아이콘',
    },
    children: { control: 'text', description: '뱃지명' },
  },

  args: {
    badgeCode: BADGE_ENUM.ACTIVE,
    addIcon: icons.None,
    isMaxLength: false,
    children: '뱃지',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const stories = {
  Default: {
    args: {
      badgeCode: USER_ENUM.ADMIN_MAIN,
      children: '뱃지',
      isMaxLength: false,
    },
  },
  LIMIT_WIDTH: {
    args: {
      badgeCode: BADGE_ENUM.ACTIVE,
      children: '80px 뱃지 길이제한',
      isMaxLength: true,
    },
  },

  WITH_ICON_AND_LIMIT: {
    args: {
      isMaxLength: true,
      badgeCode: BADGE_ENUM.ACTIVE,
      addIcon: (
        <CircleCheckBig className='h-badge-icon w-badge-icon font-bold text-active' />
      ),
      children: '뱃지의 길이만큼 늘어납니다',
    },
  },
  WITH_ICON: {
    args: {
      isMaxLength: false,
      badgeCode: BADGE_ENUM.ACTIVE,
      addIcon: (
        <CircleCheckBig className='h-badge-icon w-badge-icon font-bold text-active' />
      ),
      children: '뱃지의 길이만큼 늘어납니다',
    },
  },
  WITH_TAIL_ICON: {
    args: {
      isMaxLength: false,
      isTailIcon: true,
      badgeCode: BADGE_ENUM.ACTIVE,
      addIcon: (
        <CircleCheckBig className='h-badge-icon w-badge-icon font-bold text-active' />
      ),
      children: '뱃지의 길이만큼 늘어납니다',
    },
  },
} satisfies Record<string, Story>;

export const DEFAULT = stories.Default;
export const LIMIT_WIDTH = stories.LIMIT_WIDTH;
export const WITH_ICON_AND_LIMIT = stories.WITH_ICON_AND_LIMIT;
export const WITH_ICON = stories.WITH_ICON;
export const WITH_TAIL_ICON = stories.WITH_TAIL_ICON;

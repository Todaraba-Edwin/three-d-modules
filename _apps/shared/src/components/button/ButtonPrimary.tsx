import { colors } from '@/styles/colors.js';
import type { fontSize } from '@/styles/fontSize.js';
import clsx from 'clsx';
import { type ReactNode } from 'react';

type VariantUnion = 'default' | 'none' | keyof typeof colors;

type Props = React.ComponentProps<'button'> & {
  variant?: VariantUnion;
  size?: 'default' | 'sm' | 'lg' | 'xl';
  fontSize?: keyof typeof fontSize;
  isTruncate?: boolean;
};

// variantClasses
const getColorStyles = (color: VariantUnion) => {
  switch (color) {
    case 'default':
      const defaultColor = 'slate-300';
      return clsx(
        `border-${defaultColor}-bg hover:border-${defaultColor}-bg/80`,
        `bg-transparent hover:bg-${defaultColor}-bg/80`
      );
    case 'none':
      return 'border-white bg-transparent';
    default:
      return clsx(
        `border-${color}-bg hover:border-${color}-bg/80`,
        `bg-${color}-bg hover:bg-${color}-bg/80`,
        `text-${color}-font`
      );
  }
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  default: getColorStyles('default'),
  none: getColorStyles('none'),
  primary: getColorStyles('primary'),
  secondary: getColorStyles('secondary'),
  tertiary: getColorStyles('tertiary'),
  error: getColorStyles('error'),
};

// size 별 클래스
const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  default: 'w-full1 p-2',
  sm: 'max-w-btn-sm w-btn-sm p-1',
  lg: 'max-w-btn-lg w-btn-lg p-2',
  xl: 'max-w-btn-xl w-btn-xl p-3',
};

const fontSizeClasses: Record<NonNullable<Props['fontSize']>, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const ButtonPrimary = ({
  variant = 'default',
  children = '버튼명',
  size = 'default',
  fontSize = 'base',
  isTruncate = false,
  ...rest
}: Props): ReactNode => {
  return (
    <button
      className={clsx(
        // ─ 기본 레이아웃 ─
        'box-border min-h-5 min-w-10 break-all rounded-2xl border',

        // ─ 전환 효과 ─
        'transition-all',

        // ─ 비활성화 상태 ─
        // 비활성화 시 클릭 불가 + 반투명 처리
        'disabled:pointer-events-none disabled:opacity-50',

        // ─ SVG 아이콘 관련 ─
        '[&_svg]:pointer-events-none', // 아이콘 클릭 불가
        "[&_svg:not([class*='size-'])]:size-4", // size- 클래스가 없으면 기본 1rem(4) 크기 적용
        '[&_svg]:shrink-0', // flex shrink 방지로 아이콘 찌그러짐 방지

        // ─ 포커스 상태 ─
        // 포커스 시 테두리 + ring 강조, outline 제거
        'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',

        sizeClasses[size],
        fontSizeClasses[fontSize],
        variantClasses[variant],
        {
          truncate: isTruncate,
        }
      )}
      {...{ children, ...rest }}
    />
  );
};

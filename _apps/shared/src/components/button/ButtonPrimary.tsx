import { colors } from '@/styles/colors.js';
import type { fontSize } from '@/styles/fontSize.js';
import clsx from 'clsx';
import { type ReactNode } from 'react';

type VariantUnion =
  | 'default'
  | 'none'
  | Exclude<keyof typeof colors, 'active' | 'un_active'>;

type FontSizeUnion = Exclude<keyof typeof fontSize, 'xs-weight'>;

type Props = React.ComponentProps<'button'> & {
  variant?: VariantUnion;
  size?: 'default' | 'fit' | 'sm' | 'lg' | 'xl';
  fontSize?: FontSizeUnion;
  isTruncate?: boolean;
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  default:
    'border-slate-300-bg bg-transparent hover:border-slate-300-bg/80 hover:bg-slate-300-bg/80',
  none: 'border-white bg-transparent',
  primary:
    'border-primary-bg bg-primary-bg text-primary-font hover:border-primary-bg/80 hover:bg-primary-bg/80',
  secondary:
    'border-secondary-bg bg-secondary-bg text-secondary-font hover:border-secondary-bg/80 hover:bg-secondary-bg/80',
  tertiary:
    'border-tertiary-bg bg-tertiary-bg text-tertiary-font hover:border-tertiary-bg/80 hover:bg-tertiary-bg/80',
};

// size 별 클래스
const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  default: 'w-full',
  fit: '',
  sm: 'max-w-btn-sm w-btn-sm',
  lg: 'max-w-btn-lg w-btn-lg',
  xl: 'max-w-btn-xl w-btn-xl',
};

const fontSizeClasses: Record<NonNullable<Props['fontSize']>, string> = {
  xs: 'text-xs py-1 px-2',
  sm: 'text-sm py-1 px-3',
  base: 'text-base py-2 px-4',
  xl: 'text-xl py-2 px-4',
  '2xl': 'text-2xl py-2 px-4',
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

import clsx from 'clsx';
import type { ReactNode } from 'react';
import React from 'react';
import { BADGE_ENUM, TruncateParagraph, USER_ENUM } from '..';

type Props = React.ComponentProps<'p'> & {
  badgeCode: keyof typeof USER_ENUM | keyof typeof BADGE_ENUM;
  addIcon?: ReactNode;
  isMaxLength?: boolean;
};

const TAILWIND = {
  ROOT_LAYOUT: 'text-xs-weight rounded-lg px-2 py-1',
  ROO_MAX_LENGTH: 'max-w-badge-max',
  CHILD_FLEX_WITH_ICON: 'flex items-center gap-x-1',
  CHILD_TEXT_ACTIVE: 'text-active',
};

export const Badge = ({
  badgeCode,
  addIcon,
  isMaxLength = false,
  children,
  ...props
}: Props): ReactNode => {
  return (
    <figure
      data-slot='badge'
      className={clsx(TAILWIND.ROOT_LAYOUT, {
        [TAILWIND.ROO_MAX_LENGTH]: isMaxLength,
        badge_admin_main: badgeCode === USER_ENUM.ADMIN_MAIN,
        badge_admin_sub: badgeCode === USER_ENUM.ADMIN_SUB,
        badge_admin_users: badgeCode === USER_ENUM.ADMIN_USERS,
        badge_active: badgeCode === BADGE_ENUM.ACTIVE,
        badge_un_active: badgeCode === BADGE_ENUM.UN_ACTIVE,
      })}
      {...props}
    >
      <TruncateParagraph
        {...(addIcon && { addStyles: TAILWIND.CHILD_FLEX_WITH_ICON })}
      >
        {addIcon && (
          <span
            className={clsx({
              [TAILWIND.CHILD_TEXT_ACTIVE]: badgeCode === BADGE_ENUM.ACTIVE,
            })}
            children={addIcon}
          />
        )}
        <TruncateParagraph isMaxLength={isMaxLength} children={children} />
      </TruncateParagraph>
    </figure>
  );
};

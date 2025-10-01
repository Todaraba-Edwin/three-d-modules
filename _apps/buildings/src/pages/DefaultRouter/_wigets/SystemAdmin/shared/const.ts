import { Shield, Users } from 'lucide-react';

export const BM_CONST = {
  Tab: {
    title: '건물 관리',
    desc: '건물동 및 해당 건물의 층별정보를 관리합니다.',
  },
} as const;

export const UM_CONST: {
  Tab: TabConst;
  LeftSection: SectionConst;
  RightSection: SectionConst;
} = {
  Tab: {
    title: '사용자 및 권한 관리',
    desc: '시스템 권한과 사용자 계정을 관리합니다.',
  },
  LeftSection: {
    ICON: Shield,
    title: '권한 관리',
    desc: '역할별 시스템 접근 권한을 설정합니다.',
    addActionName: '역할 추가',
  },
  RightSection: {
    title: '사용자 관리',
    desc: '사용자를 관리합니다',
    ICON: Users,
    addActionName: '사용자 추가',
  },
};

import type { ViewerProps } from '../05_shared/types';
import { utilsAddHorizontalLine } from './utilsAddHorizontalLine';
import { utilsAddVerticalLine } from './utilsAddVerticalLine';

type HorizontalLine = {
  type: 'horizontal';
  index: number;
  lon: number;
  lat: number;
  height: number;
  distance: number;
  isStart?: boolean;
};

type VerticalLine = {
  type: 'vertical';
  index: number;
  lon: number;
  lat: number;
  height: number;
  length: number;
  distance: number;
};

type InputLine = HorizontalLine | VerticalLine;

type Props = {
  viewer: ViewerProps['viewer'];
  lines: InputLine[];
};

export const utilsAddLines = ({ viewer, lines }: Props): void => {
  const horizontal: HorizontalLine[][] = [];
  const vertical: VerticalLine[][] = [];

  let currentGroup: HorizontalLine[] = [];

  for (const line of lines) {
    if (line.type === 'horizontal') {
      const curr = line as HorizontalLine;

      if (!currentGroup.length) {
        currentGroup.push(curr);
      } else {
        const prevLine = lines[curr.index - 1];
        const isPrevHorizontalLine = prevLine?.type === 'horizontal';
        const isCurrentGroupStart = currentGroup[0].isStart;
        if (isPrevHorizontalLine || isCurrentGroupStart) {
          currentGroup.push(curr);
        } else {
          horizontal.push(currentGroup);
          currentGroup = [curr];
        }
      }
    }

    if (line.type === 'vertical') {
      const curr = line as VerticalLine;

      if (currentGroup.length > 0) {
        horizontal.push(currentGroup);
        currentGroup = [
          {
            type: 'horizontal',
            isStart: true,
            index: curr.index,
            lon: curr.lon,
            lat: curr.lat,
            height: curr.length - curr.height,
            distance: 0.0,
          },
        ];
      }

      vertical.push([curr]);
    }
  }

  // 남은 수평선 마무리
  if (currentGroup.length > 0) {
    horizontal.push(currentGroup);
  }

  horizontal.forEach(lineGroup => {
    utilsAddHorizontalLine({
      viewer,
      lineList: lineGroup,
    });
  });
  vertical.forEach(lineGroup => {
    utilsAddVerticalLine({
      viewer,
      lineList: lineGroup,
    });
  });

  return;
};

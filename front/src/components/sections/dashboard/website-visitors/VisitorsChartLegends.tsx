import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import VisitorsChartLegend from './VisitorsChartLegend';
import EChartsReactCore from 'echarts-for-react/lib/core';

interface LegendsProps {
  chartRef: React.RefObject<EChartsReactCore>;
}

export const legendsData = [
  {
    id: 1,
    type: 'Utilities sector',
    rate: '30%',
  },
  {
    id: 2,
    type: 'Grocery sector',
    rate: '60%',
  },
  {
    id: 3,
    type: 'Transport sector',
    rate: '50%',
  },
];

const VisitorsChartLegends = ({ chartRef }: LegendsProps) => {
  const theme = useTheme();
  const [toggleColor, setToggleColor] = useState({
    organic: true,
    social: true,
    direct: true,
  });

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      handleToggleLegend(e as unknown as React.MouseEvent, null);
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  const getActiveColor = (type: string) => {
    if (type === 'Utilities sector') {
      return theme.palette.primary.main;
    } else if (type === 'Grocery sector') {
      return theme.palette.secondary.lighter;
    } else if (type === 'Transport sector') {
      return theme.palette.secondary.main;
    }
  };

  const getDisableColor = (type: string) => {
    if (type === 'Utilities sector') {
      return theme.palette.primary.dark;
    } else if (type === 'Grocery sector') {
      return theme.palette.secondary.darker;
    } else if (type === 'Transport sector') {
      return theme.palette.secondary.dark;
    }
  };

  const handleToggleLegend = (e: React.MouseEvent, type: string | null) => {
    e.stopPropagation();
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const option = echartsInstance.getOption() as echarts.EChartsOption;

    if (type === 'Utilities sector') {
      setToggleColor({ organic: true, social: false, direct: false });
    } else if (type === 'Grocery sector') {
      setToggleColor({ organic: false, social: true, direct: false });
    } else if (type === 'Transport sector') {
      setToggleColor({ organic: false, social: false, direct: true });
    } else {
      setToggleColor({ organic: true, social: true, direct: true });
    }

    if (Array.isArray(option.series)) {
      const series = option.series.map((s) => {
        if (Array.isArray(s.data)) {
          s.data.forEach((item) => {
            if (type !== null && item.itemStyle && item.itemStyle.color) {
              if (type === item.type) {
                item.itemStyle.color = getActiveColor(item.type);
              } else {
                item.itemStyle.color = getDisableColor(item.type);
              }
            } else {
              item.itemStyle.color = getActiveColor(item.type);
            }
          });
        }
        return s;
      });

      echartsInstance.setOption({ series });
    }
  };

  return (
    <Stack mt={-1} spacing={3} direction="column">
      {legendsData.map((item) => (
        <VisitorsChartLegend
          key={item.id}
          data={item}
          toggleColor={toggleColor}
          handleToggleLegend={handleToggleLegend}
        />
      ))}
    </Stack>
  );
};

export default VisitorsChartLegends;

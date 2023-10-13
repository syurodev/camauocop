import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type IProps = {
  chartData: ChartData<"bar", number[], unknown>,
  chartTitle: string
}

const VerticalBarChart: React.FC<IProps> = ({ chartData, chartTitle }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  return (
    <>
      <Bar options={options} data={chartData} />
    </>
  )
}

export default React.memo(VerticalBarChart)
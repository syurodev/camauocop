import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type IProps = {
  chartData: ChartData<"doughnut", number[], unknown>,
  chartTitle: string
}

const DoughnutChart: React.FC<IProps> = ({ chartData, chartTitle }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  return (
    <div>
      <Doughnut
        data={chartData}
        width={500}
        height={500}
        options={options}
      />
    </div>
  )
}

export default React.memo(DoughnutChart)
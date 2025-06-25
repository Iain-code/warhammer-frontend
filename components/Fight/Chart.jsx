import PropTypes from 'prop-types';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MyChart = ({ data }) => {
  const chartData = {
    labels: data.map(row => row.year),
    datasets: [
      {
        label: 'Acquisitions by year',
        data: data.map(row => row.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  const options = {
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return <Bar data={chartData} options={options} />;
};

MyChart.propTypes = {
  data: PropTypes.object
}

export default MyChart;
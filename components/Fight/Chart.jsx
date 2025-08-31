import PropTypes from 'prop-types'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)


const MyBarChart = ({ input, name, modifier }) => {

  const success = Object.entries(input).map(item => item[0] >= modifier ? item : null )

  const failed = Object.entries(input).map(item => item[0] < modifier ? item : null )

  const labels = [
    ...Object.keys(input).filter(k => Number(k) < modifier),
    ...Object.keys(input).filter(k => Number(k) >= modifier)
  ]

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          weight: 'bold',
          font: ctx => {
            const w = ctx.chart.width;
            if (w < 400) return { size: 10 };
            if (w < 800) return { size: 16 };
            return { size: 18 };
          }
        }
      },
      title: {
        display: true,
        text: name,
        color: 'white',
        font: ctx => {
          const w = ctx.chart.width;
          if (w < 400) return { size: 10 };
          if (w < 800) return { size: 16 };
          return { size: 18 };
        }
      },
    },
    scales: {
      x: { stacked: true, ticks: { color: 'white' }, grid: { color: '#444' } },
      y: { stacked: true, ticks: { color: 'white' }, grid: { color: '#444' } },
    },
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'failed',
        data: failed,
        backgroundColor: 'red'
      },
      {
        label: 'successful',
        data: success,
        backgroundColor: 'grey'
      }
    ]
  }
  return <Bar options={options} data={data} />
}

MyBarChart.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  modifier: PropTypes.number
}

export default MyBarChart
import PropTypes from 'prop-types'
import React from 'react'
import { Bar } from 'react-chartjs-2'

/*
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
*/

const MyBarChart = ({ input }) => {
  console.log('INPUT:', input)
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    }
  }

  const data = {
    labels: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
    datasets: [
      {
        data: input,
        backgroundColor: 'orangered'
      }
    ]
  }

  return <Bar options={options} data={data} />
}

MyBarChart.propTypes = {
  input: PropTypes.object
}

export default MyBarChart
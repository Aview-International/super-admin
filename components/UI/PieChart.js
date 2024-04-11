import React from 'react';
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

const PieChartComponent = ({data}) => {
    console.log(data);
    if (!data){
        data  = {
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [
              {
                label: '',
                data: [100],
                backgroundColor: [
                  'rgba(252, 252, 252, 0.15)'
                ],
                borderColor: [
                  'rgba(252, 252, 252, 0.15)'
                ],
                borderWidth: 1,
              },
            ],
        };
    }
    console.log(data);


  return <Pie data={data} options={{ responsive: true }}/>;
};

export default PieChartComponent;

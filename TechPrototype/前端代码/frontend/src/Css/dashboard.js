/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace()

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },
        {
          data: [
            35339,
            41345,
            28483,
            74003,
            63489,
            54092,
            12034
          ],
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#ff7b00',
          borderWidth: 4,
          pointBackgroundColor: '#ff7b00'
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
}())

<template>
<q-card class="q-pa-md">
  <q-card-section>
    <div class="text-h4 text-bold">
      Test Chart
    </div>
  </q-card-section>
  <q-card-section>
  <div class="small">
    <line-chart :chart-data="datacollection" :options="options"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
  </q-card-section>
</q-card>
</template>

<script>
import LineChart from './LineChart.js'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      options: {
        gridLines: {
          display: true
        },
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'series',
            time: {
              unit: 'day',
              displayFormats: {
                quarter: 'hA D MMM YYYY'
              }
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.fillData()
    // when chart is mounted, it should pull the data from the server
  },
  methods: {
    fillData () {
      this.datacollection = {
        datasets: [
          {
            label: 'Data One',
            borderColor: '#00A2BF',
            fill: false,
            data: [{ t: new Date(2020, 10, 10, 10, 10, 10, 10), y: this.getRandomInt() }, { t: new Date(2020, 10, 11, 10, 10, 10, 10), y: this.getRandomInt() }]
          }, {
            label: 'Data One',
            borderColor: '#f87979',
            fill: false,
            data: [{ t: new Date(2020, 10, 10, 10, 10, 10, 10), y: this.getRandomInt() }, { t: new Date(2020, 10, 11, 10, 10, 10, 10), y: this.getRandomInt() }]
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

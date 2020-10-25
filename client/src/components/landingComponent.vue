<template>
  <div class="row">
    <div class="col q-pa-md">
        <q-card class="q-pa-md full-height full-width" style="max-height:700px">
          <div class="row items-center justify-center  q-pa-md">
            <div class="col-auto text-h3 q-pa-md text-bold">Your Tickers</div>
            <div class="col-auto">
              <q-btn color="primary" text-color="white" round icon="add" @click="dialog = true" />
              <q-dialog v-model="dialog">
                <div v-if="loadingState" class="col" style="width:500px; height:300px">
                  <loading />
                </div>
                <q-card>
                  <div class="q-pa-md row items-center">
                    <div class="col" style="width:500px" v-if="!loadingState">
                      <div class="text-h5 text-bold">Click or Search for a ticker</div>
                      <div class="row items-center q-pa-md">
                        <q-input
                          outlined
                          debounce="500"
                          class="full-width"
                          label="Search for Stock Ticker"
                          @input="searchTickerQuery"
                          clearable
                        ></q-input>
                      </div>
                      <div class="q-py-md">
                        <q-table
                          color="primary"
                          style="height:300px"
                          :data="stockTickerSearch"
                          :columns="stockTickerColumns"
                          row-key
                          virtual-scroll
                          :virtual-scroll-item-size="48"
                          @request="searchTickerQuery"
                          @row-click="rowClick"
                        />
                      </div>
                    </div>
                  </div>
                </q-card>
              </q-dialog>
            </div>
          </div>
          <div v-if="currentStockTickers.length === 0" class="q-pa-md">You need to search some tickers. Click Add Ticker.</div>
          <div style="max-height: 500px" class="list scroll q-pa-md">
            <q-list>
              <q-item v-for="ticker in currentStockTickers" :key="ticker.ticker_id" clickable>
                <q-item-section class="text-body text-bold">{{ ticker.ticker }}</q-item-section>
                <q-item-section class="text-body text-bold">{{ ticker.exchange }}</q-item-section>
                <q-item-section side>
                  <q-icon
                    name="delete"
                    color="red"
                    class="cursor-pointer"
                    @click="deleteTicker(ticker.ticker_id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
    </div>
    <div class="col q-pa-md">
      <q-card class="q-pa-md full-height full-width" style="max-height:700px">
        <q-card-section>
          <div class="row items-center justify-center">
            <div class="col-auto text-h3 q-pa-md text-bold">Sentiment</div>
            <div class="col-auto">
              <q-btn
                color="primary"
                round
                icon="replay"
                text-color="white"
                @click="analyzeTickers()"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
            <line-chart v-if="!analysisChartLoading" :chart-data="chartData" :options="chartOptions"></line-chart>
            <div class="row items-center justify-center">
              <q-spinner-bars
                v-if="analysisChartLoading"
                color="primary"
                size="5em"
              />
            </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col q-pa-md">
      <q-card class="q-pa-md full-height full-width" style="max-height:700px">
        <q-card-section>
          <div class="row items-center justify-center">
            <div class="text-h3 q-pa-md text-bold">Average</div>
            <div class="col-auto">
              <q-btn
                round
                icon="replay"
                color="primary"
                text-color="white"
                @click="analyzeAverage()"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <line-chart v-if="!historicalChartLoading" :chart-data="averageChartData" :options="chartOptions"></line-chart>
            <div class="row items-center justify-center">
              <q-spinner-bars
                v-if="historicalChartLoading"
                color="primary"
                size="5em"
              />
            </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart.js'
import axios from 'axios'

export default {
  name: 'landingComponent',
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      currentTickers: [],
      chartData: {},
      averageChartData: {},
      chartOptions: {
        gridLines: {
          display: true
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Sentiment (%)'
            }
          }],
          xAxes: [
            {
              type: 'time',
              distribution: 'series',
              scaleLabel: {
                display: true,
                labelString: 'Time'
              },
              time: {
                unit: 'day',
                displayFormats: {
                  quarter: 'DD MM YYYY h:mm:ss.SSS a'
                }
              }
            }
          ]
        }
      },
      items: [],
      dialog: false,
      loadingState: true,
      analysisChartLoading: false,
      historicalChartLoading: false,
      currentStockTickers: null,
      stockTickerSearch: [],
      tickers: [],
      stockTickerColumns: [
        {
          name: 'symbol',
          required: true,
          label: 'Ticker',
          field: (row) => row.symbol,
          align: 'left',
          sortable: false
        },
        {
          name: 'description',
          required: true,
          label: 'Description',
          field: (row) => row.description,
          align: 'left',
          sortable: false
        },
        {
          name: 'exchange',
          required: true,
          label: 'Exchange',
          field: (row) => row.exchange,
          align: 'left',
          sortable: false
        }
      ]
    }
  },
  mounted () {
    // on mounted, it needs to go out and fetch the current tickers from the database
    this.loadingState = true
    axios
      .get('api/ticker/current-tickers')
      .then((response) => {
        this.currentStockTickers = response.data.tickers
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loadAnalysisChart()
        this.loadHistoricalChart()
      })
    axios
      .get('api/tradingview/search-top-tickers')
      .then((response) => {
        this.stockTickerSearch = response.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loadingState = false
      })
  },
  methods: {
    loadAnalysisChart () {
      var tickerPromiseArr = []
      var updatedChartData = []
      console.log(this.currentStockTickers)
      if (this.currentStockTickers.length != null) {
        this.currentStockTickers.forEach((tickers) => {
          tickerPromiseArr.push(
            axios.get(`api/tweets/analysis/${tickers.ticker}`)
          )
        })
      } else {
        // TODO: throw an error saying that you cant analyze any tickers
      }
      Promise.all(tickerPromiseArr)
        .then((response) => {
          response.forEach((tweetData) => {
            updatedChartData.push(
              this.updateAnalysisChart(tweetData.data.tweets)
            )
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.chartData = {
            datasets: updatedChartData
          }
        })
    },
    loadHistoricalChart () {
      var tickerPromiseArr = []
      var updatedChartData = []
      console.log(this.currentStockTickers)
      if (this.currentStockTickers.length != null) {
        this.currentStockTickers.forEach((tickers) => {
          tickerPromiseArr.push(
            axios.get(`api/tweets/historical-analysis/${tickers.ticker}`)
          )
        })
      } else {
        // TODO: throw an error saying that you cant analyze any tickers
      }
      Promise.all(tickerPromiseArr)
        .then((response) => {
          response.forEach((tweetData) => {
            updatedChartData.push(this.updateAverageChart(tweetData.data.historicalAverage))
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.averageChartData = {
            datasets: updatedChartData
          }
        })
    },
    analyzeAverage () {
      var tickerPromiseArr = []
      var updatedChartData = []
      if (this.currentStockTickers.length != null) {
        this.currentStockTickers.forEach((tickers) => {
          tickerPromiseArr.push(
            axios.post('api/tweets/historical-analysis', { ticker: tickers.ticker })
          )
        })
      } else {
        // TODO: throw an error saying that you cant analyze any tickers
      }
      this.historicalChartLoading = true
      Promise.all(tickerPromiseArr)
        .then((response) => {
          response.forEach((tweetData) => {
            updatedChartData.push(this.updateAverageChart(tweetData.data.historicalAverage))
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.averageChartData = {
            datasets: updatedChartData
          }
          this.historicalChartLoading = false
        })
    },
    analyzeTickers () {
      var tickerPromiseArr = []
      var updatedChartData = []
      console.log(this.currentStockTickers)
      if (this.currentStockTickers.length != null) {
        this.currentStockTickers.forEach((tickers) => {
          tickerPromiseArr.push(
            axios.post('api/tweets/analysis', { ticker: tickers.ticker })
          )
        })
      } else {
        // TODO: throw an error saying that you cant analyze any tickers
      }
      this.analysisChartLoading = true
      Promise.all(tickerPromiseArr)
        .then((response) => {
          response.forEach((tweetData) => {
            updatedChartData.push(this.updateAnalysisChart(tweetData.data.tweets))
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.chartData = {
            datasets: updatedChartData
          }
          this.analysisChartLoading = false
        })
    },
    updateAnalysisChart (tweetData) {
      var data = []
      var tickerName = ''
      tweetData.forEach((tweets) => {
        data.push({ t: tweets.tweet_date, y: tweets.sentiment })
        tickerName = tweets.ticker
      })
      var returnObj = {
        label: tickerName,
        borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        fill: false,
        lineTension: 0.5,
        pointRadius: 0.1,
        data: data
      }
      return returnObj
    },
    updateAverageChart (tweetData) {
      var data = []
      var tickerName = ''
      console.log(tweetData)
      tweetData.forEach((tweets) => {
        data.push({ t: tweets.created_date, y: tweets.average_sentiment })
        tickerName = tweets.ticker
      })
      var returnObj = {
        label: tickerName,
        borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        fill: false,
        lineTension: 0.5,
        pointRadius: 0.1,
        data: data
      }
      return returnObj
    },
    resetData () {
      this.currentStockTickers = []
    },
    updateTicker (ticker, exchange) {
      this.tickers.push({ ticker: ticker, exchange: exchange })
    },
    searchTickerQuery (ticker) {
      axios
        .get('api/tradingview/search-ticker?ticker=' + ticker)
        .then((response) => {
          this.stockTickerSearch = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    rowClick (evt, row) {
      this.tickers.push({ ticker: row.symbol, exchange: row.exchange })
      console.log(this.tickers)
      axios
        .post('api/ticker/current-ticker', {
          ticker: row.symbol,
          exchange: row.exchange
        })
        .then((response) => {
          this.currentStockTickers = response.data.tickers
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.dialog = false
        })
    },
    deleteTicker (tickerId) {
      console.log(tickerId)
      axios
        .delete(`api/ticker/delete-ticker/${tickerId}`)
        .then((response) => {
          this.currentStockTickers = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

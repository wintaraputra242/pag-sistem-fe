<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { jenis_id } from '@/helpers/dataUser'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    type: {
      type: String,
      default: 'line'
    },
    label: {
      type: Array,
      default: () => [],
      required: true
    },
    data: {
      type: Object,
      default: () => {},
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '80rem'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: function() {
        return {
          tanggal: [],
          antrian: [],
          pemberi_rating: [],
          rata: [],
          datang: [],
          dilayani: [],
          batal: [],
          reject: []
        }
      },
      // required: true
      required: false
    }
  },
  data() {
    return {
      chart: null,
      jenis_id

    }
  },
  computed: {
    legendText() {
      if (this.jenis_id === '11') {
        return ['Input', 'Capaian']
      }
      return ['Input', 'Capaian']
    }
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler(val) {
    //     this.setOptions(val)
    //   }
    // }
  },
  mounted() {
    setInterval(() => {
      this.$nextTick(() => {
        this.initChart()
      })
    }, 500)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    formatDate(dates) {
      const temp = []
      for (const el of dates) {
        const [year, month, day] = el.split('-') // 2022-12-01
        const result = [day, month, year].join('-') // 01-12-2011
        temp.push(result)
      }
      return temp
    },
    initChart() {
      this.chart = echarts.init(this.$el, '')
      this.setOptions(this.chartData)
    },
    setOptions({ tanggal, antrian, pemberi_rating, datang, dilayani, batal, reject } = {}) {
      this.chart.setOption({
        xAxis: {
        //   data: this.formatDate(['2022-12-01', '2022-12-01', '2022-12-01', '2022-12-01', '2022-12-01', '2022-12-01', '2022-12-01']),
        //   nameRotate: 70,
        //   // nameTextStyle: {
        //   //   color: 'blue'
        //   // },
        //   axisLabel: {
        //     rotate: 50,
        //     color: '#000'
        //   },
        //   boundaryGap: true,
        //   axisTick: {
        //     show: true
        //   }
        },

        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: '15%',
          containLabel: true
        },
        tooltip: {
          // axisPointer: {
          //   type: 'cross'
          // },
          // padding: [5, 10],
          alwaysShowContent: false,
          trigger: 'axis'
        },
        // yAxis: {
        //   // axisLabel: {
        //   //   color: '#000'
        //   // },
        //   // axisTick: {
        //   //   show: true
        //   // }
        // },
        yAxis: {
          data: this.label,
          nameRotate: 70,
          // nameTextStyle: {
          //   color: 'blue'
          // },
          axisLabel: {
            rotate: 50,
            color: '#000'
          },
          boundaryGap: true,
          axisTick: {
            show: true
          }
        },
        legend: {
          data: this.legendText
        },
        series: [
          {
            name: this.legendText[0],
            itemStyle: {
              normal: {
                color: '#ef4444',
                lineStyle: {
                  // color: '#FF005A',
                  // width: 2
                  // type: 'solid'
                }
              }
            },
            // smooth: true,
            type: this.type,
            inverse: true,
            symbol: 'circle',
            symbolSize: 8,
            data: this.data?.input,
            animationDuration
          },
          {
            name: this.legendText[1],
            itemStyle: {
              normal: {
                color: '#2563eb',
                lineStyle: {
                  // color: '#FF005A',
                  // width: 2
                  // type: 'solid'
                }
              }
            },
            // smooth: true,
            type: this.type,
            inverse: true,
            symbol: 'circle',
            symbolSize: 8,
            data: this.data?.capaian,
            animationDuration
          }
          // {
          //   name: this.legendText[1],
          //   itemStyle: {
          //     normal: {
          //       // color: '#FF005A',
          //       lineStyle: {
          //         // color: '#FF005A',
          //         // width: 2
          //         type: 'dashed'
          //       }
          //     }
          //   },
          //   // smooth: true,
          //   type: this.type,
          //   inverse: true,
          //   symbol: 'circle',
          //   symbolSize: 8,
          //   data: ['1', '2', '5', '4', '7', '10', '12'].reverse(),
          //   animationDuration
          // },
          // {
          //   name: this.legendText[2],
          //   itemStyle: {
          //     normal: {
          //       // color: '#FF005A',
          //       lineStyle: {
          //         // color: '#FF005A',
          //         // width: 2
          //         type: 'dotted'
          //       }
          //     }
          //   },
          //   // smooth: true,
          //   type: this.type,
          //   inverse: true,
          //   symbol: 'circle',
          //   symbolSize: 8,
          //   data: ['1', '2', '5', '4', '7', '10', '12'],
          //   animationDuration
          // }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-card {
    padding: 0;
    margin: 0;
    text-align: center;
    font-size: 30px;
    position: relative;
  }
</style>

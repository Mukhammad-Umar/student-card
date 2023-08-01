import ru from 'apexcharts/dist/locales/ru.json'

export const TranByDayChart = {
  chart: {
    type: 'area',
    locales: [ru],
    defaultLocale: 'ru',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false,
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
      borderRadius: 15
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 3,
    show: true,
    curve: 'smooth'
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    labels: {
      formatter: function (value: string) {
        return Number(value).toLocaleString('ru-RU')
      }
    },
    tickAmount: 5
  },
  colors: ['#16B1FF', '#FFB400'],
  tooltip: {
    y: {
      formatter: function (val: string) {
        return Number(val).toLocaleString('ru-RU')
      },
      title: {
        formatter: (seriesName: string) => seriesName
      }
    }
  },
  fill: {
    opacity: 0.6
  },
  legend: {
    onItemClick: {
      toggleDataSeries: false
    }
  }
}

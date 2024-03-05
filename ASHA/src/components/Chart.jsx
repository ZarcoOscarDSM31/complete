import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
      options: {
        chart: {
          height: 500,
          type: 'line',
          zoom: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Temperatura y Humedad',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: []
        }
      }
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('http://localhost:3000/historial')
      .then(response => response.json())
      .then(data => {
        const categories = [];
        const humidityData = [];
        const temperatureData = [];

        data.forEach(item => {
          categories.push(item.fecha_hora);
          if (item.unidades === '%') {
            humidityData.push(item.val_numerico);
          } else if (item.unidades === '°C') {
            temperatureData.push(item.val_numerico);
          }
        });

        this.setState({
          series: [
            { name: "Porcentaje de Humedad", data: humidityData },
            { name: "Temperatura (°C)", data: temperatureData }
          ],
          options: {
            ...this.state.options,
            xaxis: { categories: categories }
          }
        });
      })
      .catch(error => console.error('Error al obtener los datos de la API:', error));
  };

  handleChartTypeChange = event => {
    const chartType = event.target.value;
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        chart: {
          ...prevState.options.chart,
          type: chartType
        }
      }
    }));
  };

  renderChart = () => {
    const { series, options } = this.state;

    return (
      <ReactApexChart options={options} series={series} type={options.chart.type} height={350} />
    );
  };

  renderChartTypeSelect = () => {
    return (
      <select className="min-w-4  text-black" value={this.state.options.chart.type} onChange={this.handleChartTypeChange}>
        <option value="line">Línea</option>
        <option value="bar">Barras</option>
        <option value="area">Area</option>

      </select>
    );
  };

  render() {
    return (
      <div>
        {this.renderChartTypeSelect()}
        <div id="chart">
          {this.renderChart()}
        </div>
      </div>
    );
  }
}

export default ApexChart;

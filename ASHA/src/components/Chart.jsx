import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Chart extends Component {
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
          align: 'left',
          style: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '14px',
              color: '#555'
            }
          }
        }
      }
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('http://localhost:3000/historial')
      .then(response => {
        console.log('Respuesta del servidor:', response); // Añade esta línea para debug
        return response.json();
      })
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

  handleFilterChange = event => {
    const selectedFilter = event.target.value;
  
    fetch('http://localhost:3000/historial')
      .then(response => {
        console.log('Respuesta del servidor:', response);
        return response.json();
      })
      .then(data => {
        let filteredData = [];
  
        if (selectedFilter === 'all') {
          // Si el filtro es 'all', mostrar todos los datos sin filtrar
          filteredData = data;
        } else {
          // Filtrar los datos según el valor seleccionado en el filtro
          filteredData = data.filter(item => {
            return item.unidades.toLowerCase().includes(selectedFilter.toLowerCase());
          });
        }
  
        const categories = [];
        const humidityData = [];
        const temperatureData = [];
  
        filteredData.forEach(item => {
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
  
    console.log('Filtro cambiado:', selectedFilter);
  };
  

  renderChart = () => {
    const { series, options } = this.state;

    return (
      <ReactApexChart options={options} series={series} type={options.chart.type} height={500} />
    );
  };

  renderFilters = () => {
    return (
      <select
        className="min-w-1/4 py-2 px-4 bg-gray-100 bg-opacity-80 text-black rounded focus:outline-none focus:shadow-outline mb-3"
        onChange={this.handleFilterChange}
      >
        <option value="all">Todos los Sensores</option>
        <option value="1">Temperatura</option>
        <option value="2">Humedad</option>
      </select>
    );
  };

  renderChartTypeSelect = () => {
    return (
      <select
        className="min-w-1/4 py-2 px-4 bg-gray-100 bg-opacity-80 text-black rounded focus:outline-none focus:shadow-outline mb-2"
        value={this.state.options.chart.type}
        onChange={this.handleChartTypeChange}
      >
        <option value="line">Línea</option>
        <option value="bar">Barras</option>
        <option value="area">Área</option>
      </select>
    );
  };

  render() {
    return (
      <div className="max-w-3xl mx-auto mt-8 flex flex-col items-center">
        <div className="mb-4 flex">
          <div className="mr-56">
            {this.renderFilters()}
          </div>
          <div>
            {this.renderChartTypeSelect()}
          </div>
        </div>
        <div id="chart" className="bg-white bg-opacity-40 rounded-xl p-4 shadow-md mb-4 w-full">
          {this.renderChart()}
        </div>
      </div>
    );
  }
}

export default Chart;

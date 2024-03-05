import React, { Component } from 'react';

class ApexChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filter: 'all'
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('http://localhost:3000/historial')
      .then(response => response.json())
      .then(data => {
        this.setState({ data });
      })
      .catch(error => console.error('Error al obtener los datos de la API:', error));
  };

  handleFilterChange = event => {
    this.setState({ filter: event.target.value });
  };

  renderTable = () => {
    const { data, filter } = this.state;

    const filteredData = filter === 'all' ? data : data.filter(item => item.id_sensor.toString() === filter);

    return (
      <table className="min-w- hover:table-fixed text-black border-collapse border border-black ">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left border border-black">Fecha y Hora</th>
            <th className="text-center border border-black">Valor Numérico</th>
            <th className="text-right border border-black">Unidades</th>
          </tr>
        </thead>
        <tbody className="bg-gray-50">
          {filteredData.map(item => (
            <tr key={item._id}>
              <td className=" text-left border border-black">{item.fecha_hora}</td>
              <td className=" text-center border border-black">{item.val_numerico}</td>
              <td className="text-right border border-black">{item.unidades}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  renderFilters = () => {
    return (
      <select className="min-w-4  text-black" onChange={this.handleFilterChange}>
        <option value="all">Todos los Sensores</option>
        <option value="1">Temperatura</option>
        <option value="2">Humedad</option>
      </select>
    );
  };

  render() {
    return (
      <div className="flex flex-col">
        <div className="mb-4">{this.renderFilters()}</div>
        <div className="overflow-x-auto">
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

export default ApexChart;

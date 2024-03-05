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
      .then(response => {
        console.log('Respuesta del servidor:', response);
        return response.json();
      })
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
      <table className="min-w-full table-auto border-collapse border border-black">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left text-zinc-800 py-2 px-4 border border-black">Fecha y Hora</th>
            <th className="text-center text-zinc-800 py-2 px-4 border border-black">Valor Numérico</th>
            <th className="text-right text-zinc-800 py-2 px-4 border border-black">Unidades</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item._id} className="bg-white">
              <td className="text-left text-zinc-800 py-2 px-4 border border-black">{item.fecha_hora}</td>
              <td className="text-center text-zinc-800 py-2 px-4 border border-black">{item.val_numerico}</td>
              <td className="text-right text-zinc-800 py-2 px-4 border border-black">{item.unidades}</td>
            </tr>
          ))}
        </tbody>
      </table>

    );
  };

  
  render() {
    return (
      <div className="max-w-3xl mx-auto mt-7">
        <div className="overflow-x-auto">
          {this.renderTable()}
        </div>
      </div>
    );
  }
  
}

export default ApexChart;

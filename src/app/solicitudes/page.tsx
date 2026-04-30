'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Solicitud } from '../../types/solicitud';

export default function ListadoSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  useEffect(() => {
    cargarSolicitudes();
  }, [filtroEstado]); // Se ejecuta cada vez que cambia el filtro

  const cargarSolicitudes = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Construir URL con filtro
      let url = 'http://localhost:3000/solicitudes';
      if (filtroEstado) {
        url += `?estado=${filtroEstado}`;
      }
      
      console.log('Llamando a:', url); // Para debugging
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar solicitudes');
      
      const data = await response.json();
      console.log('Respuesta:', data); // Para debugging
      setSolicitudes(data);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      'borrador': 'bg-gray-100 text-gray-800',
      'en-proceso': 'bg-yellow-100 text-yellow-800',
      'completada': 'bg-green-100 text-green-800',
      'abandonada': 'bg-red-100 text-red-800',
      'finalizada': 'bg-blue-100 text-blue-800',
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado: string) => {
    const textos = {
      'borrador': 'Borrador',
      'en-proceso': 'En Proceso',
      'completada': 'Completada',
      'abandonada': 'Abandonada',
      'finalizada': 'Finalizada',
    };
    return textos[estado as keyof typeof textos] || estado;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">Cargando solicitudes...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mis Solicitudes
          </h1>
          <Link
            href="/solicitud/nueva"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Nueva Solicitud
          </Link>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <label htmlFor="filtro" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por estado:
          </label>
          <select
            id="filtro"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="borrador">Borrador</option>
            <option value="en-proceso">En Proceso</option>
            <option value="completada">Completada</option>
            <option value="abandonada">Abandonada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>

        {error && <ErrorMessage message={error} onRetry={cargarSolicitudes} />}

        {/* Tabla de solicitudes */}
        {solicitudes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              {filtroEstado 
                ? `No hay solicitudes en estado "${getEstadoTexto(filtroEstado)}"` 
                : 'No hay solicitudes'}
            </p>
            <Link
              href="/solicitud/nueva"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700"
            >
              Crear primera solicitud →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {solicitud._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {solicitud.tipoProducto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {solicitud.datosCliente.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(solicitud.estado)}`}>
                        {getEstadoTexto(solicitud.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitud.createdAt).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/solicitud/${solicitud._id}/editar`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </Link>
                      {solicitud.estado === 'completada' && (
                        <Link
                          href={`/solicitud/${solicitud._id}/confirmacion`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Ver
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
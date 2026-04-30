'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../components/Header';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import { solicitudApi } from '../../../services/api';
import { Solicitud } from '../../../../types/solicitud';

const estados = [
  { value: 'borrador', label: 'Borrador', color: 'gray' },
  { value: 'en-proceso', label: 'En Proceso', color: 'blue' },
  { value: 'completada', label: 'Completada', color: 'green' },
];

export default function EditarSolicitud() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [tipoProducto, setTipoProducto] = useState('');

  // Cargar datos de la solicitud
  useEffect(() => {
    cargarSolicitud();
  }, [id]);

  const cargarSolicitud = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await solicitudApi.obtenerPorId(id);
      setSolicitud(data);
      setNombre(data.datosCliente.nombre);
      setEmail(data.datosCliente.email);
      setRut(data.datosCliente.rut);
      setTipoProducto(data.tipoProducto);
    } catch (err: any) {
      console.error('Error al cargar solicitud:', err);
      setError(err.response?.data?.message || 'Error al cargar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualizar = async () => {
    setIsSaving(true);
    setError('');
    try {
      const updated = await solicitudApi.actualizar(id, {
        tipoProducto,
        datosCliente: { nombre, email, rut },
      });
      setSolicitud(updated);
      alert('Datos actualizados correctamente');
    } catch (err: any) {
      console.error('Error al actualizar:', err);
      setError(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCambiarEstado = async (nuevoEstado: string) => {
    setIsSaving(true);
    try {
      const updated = await solicitudApi.cambiarEstado(id, nuevoEstado);
      setSolicitud(updated);
      
      if (nuevoEstado === 'completada') {
        router.push(`/solicitud/${id}/confirmacion`);
      } else {
        alert(`Estado cambiado a: ${nuevoEstado}`);
      }
    } catch (err: any) {
      console.error('Error al cambiar estado:', err);
      alert(err.response?.data?.message || 'Error al cambiar estado');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalizar = () => {
    handleCambiarEstado('completada');
  };

  const handleAbandonar = async () => {
    if (confirm('¿Está seguro de que desea abandonar esta solicitud?')) {
      await handleCambiarEstado('abandonada');
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">Cargando solicitud...</p>
        </div>
      </>
    );
  }

  if (!solicitud) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="No se encontró la solicitud" onRetry={cargarSolicitud} />
        </div>
      </>
    );
  }

  const isEditable = solicitud.estado !== 'finalizada' && solicitud.estado !== 'abandonada';
  const estadoActual = estados.find(e => e.value === solicitud.estado) || { label: solicitud.estado, color: 'gray' };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Solicitud
        </h1>
        
        {/* Estado actual */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Estado actual:</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-${estadoActual.color}-100 text-${estadoActual.color}-800`}>
            {estadoActual.label}
          </span>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

        <div className="space-y-6">
          {/* Tipo de producto (solo lectura si no es editable) */}
          <div>
            <label htmlFor="tipoProducto" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Producto
            </label>
            {isEditable ? (
              <select
                id="tipoProducto"
                value={tipoProducto}
                onChange={(e) => setTipoProducto(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cuenta Corriente">Cuenta Corriente</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Préstamo Personal">Préstamo Personal</option>
                <option value="Cuenta de Ahorros">Cuenta de Ahorros</option>
              </select>
            ) : (
              <p className="px-3 py-2 bg-gray-100 rounded-md">{solicitud.tipoProducto}</p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            {isEditable ? (
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-100 rounded-md">{nombre}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditable ? (
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-100 rounded-md">{email}</p>
            )}
          </div>

          {/* RUT */}
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
              RUT
            </label>
            {isEditable ? (
              <input
                type="text"
                id="rut"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-100 rounded-md">{rut}</p>
            )}
          </div>

          {/* Botones de acción */}
          {isEditable && (
            <>
              <div className="flex gap-4">
                <button
                  onClick={handleActualizar}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleCambiarEstado('en-proceso')}
                  disabled={solicitud.estado !== 'borrador'}
                  className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition disabled:opacity-50"
                >
                  Marcar como En Proceso
                </button>
                <button
                  onClick={handleFinalizar}
                  disabled={solicitud.estado !== 'en-proceso'}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  Finalizar Solicitud
                </button>
                <button
                  onClick={handleAbandonar}
                  disabled={solicitud.estado === 'finalizada' || solicitud.estado === 'abandonada'}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  Abandonar
                </button>
              </div>
            </>
          )}

          {!isEditable && (
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                Esta solicitud ha sido {solicitud.estado} y no puede ser modificada.
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
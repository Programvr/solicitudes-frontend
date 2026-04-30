'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import { solicitudApi } from '../../../services/api';
import { Solicitud } from '../../../../types/solicitud';

export default function Confirmacion() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarSolicitud();
  }, [id]);

  const cargarSolicitud = async () => {
    setIsLoading(true);
    try {
      const data = await solicitudApi.obtenerPorId(id);
      setSolicitud(data);
    } catch (err: any) {
      console.error('Error al cargar solicitud:', err);
      setError('No se pudo cargar la información de la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">Cargando confirmación...</p>
        </div>
      </>
    );
  }

  if (error || !solicitud) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Error al cargar la solicitud'} onRetry={cargarSolicitud} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          {/* Icono de éxito */}
          <div className="text-6xl mb-4">✅</div>
          
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            ¡Solicitud Completada!
          </h1>
          
          <p className="text-lg text-green-700 mb-6">
            Su solicitud ha sido procesada exitosamente.
          </p>

          {/* Número de solicitud */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Número de solicitud</p>
            <p className="text-2xl font-mono font-bold text-gray-900">{solicitud._id}</p>
          </div>

          {/* Resumen de la solicitud */}
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">Resumen de la solicitud:</h2>
            <div className="space-y-2">
              <p><strong>Producto:</strong> {solicitud.tipoProducto}</p>
              <p><strong>Cliente:</strong> {solicitud.datosCliente.nombre}</p>
              <p><strong>Email:</strong> {solicitud.datosCliente.email}</p>
              <p><strong>RUT:</strong> {solicitud.datosCliente.rut}</p>
              <p><strong>Fecha:</strong> {new Date(solicitud.createdAt).toLocaleDateString('es-CL')}</p>
            </div>
          </div>

          {/* Mensaje de integración con Core */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              🔄 La solicitud ha sido enviada al Core Bancario a través de Mulesoft.
              <br />
              En las próximas 24 horas recibirá una confirmación por email.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Ir al inicio
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Imprimir comprobante
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
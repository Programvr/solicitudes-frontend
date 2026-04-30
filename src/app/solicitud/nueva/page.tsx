'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { solicitudApi } from '../../services/api';

// Esquema de validación
const solicitudSchema = z.object({
  tipoProducto: z.string().min(1, 'Debe seleccionar un producto'),
  nombre: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  rut: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'Formato de RUT inválido (ej: 12.345.678-9)'),
});

type FormData = z.infer<typeof solicitudSchema>;

const productos = [
  { value: 'Cuenta Corriente', label: 'Cuenta Corriente' },
  { value: 'Tarjeta de Crédito', label: 'Tarjeta de Crédito' },
  { value: 'Préstamo Personal', label: 'Préstamo Personal' },
  { value: 'Cuenta de Ahorros', label: 'Cuenta de Ahorros' },
];

export default function NuevaSolicitud() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(solicitudSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      const solicitud = await solicitudApi.crear({
        tipoProducto: data.tipoProducto,
        datosCliente: {
          nombre: data.nombre,
          email: data.email,
          rut: data.rut,
        },
      });

      // Redirigir a la página de edición
      router.push(`/solicitud/${solicitud._id}/editar`);
    } catch (err: any) {
      console.error('Error al crear solicitud:', err);
      setError(err.response?.data?.message || 'Error al crear la solicitud. Intente nuevamente.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">Creando tu solicitud...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nueva Solicitud
        </h1>
        <p className="text-gray-600 mb-8">
          Complete el formulario para iniciar su solicitud
        </p>

        {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo de producto */}
          <div>
            <label htmlFor="tipoProducto" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Producto *
            </label>
            <select
              id="tipoProducto"
              {...register('tipoProducto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.value} value={producto.value}>
                  {producto.label}
                </option>
              ))}
            </select>
            {errors.tipoProducto && (
              <p className="mt-1 text-sm text-red-600">{errors.tipoProducto.message}</p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              {...register('nombre')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Juan Pérez González"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="juan@ejemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* RUT */}
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
              RUT *
            </label>
            <input
              type="text"
              id="rut"
              {...register('rut')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12.345.678-9"
            />
            {errors.rut && (
              <p className="mt-1 text-sm text-red-600">{errors.rut.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">Formato: 12.345.678-9</p>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Continuar
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
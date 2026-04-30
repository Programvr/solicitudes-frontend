'use client';

import Link from 'next/link';
import Header from './components/Header';

const productos = [
  {
    id: 'cta-corriente',
    nombre: 'Cuenta Corriente',
    descripcion: 'Maneja tu dinero con total libertad y beneficios exclusivos',
    icono: '🏦',
    requisitos: 'RUT, ingresos demostrables'
  },
  {
    id: 'tarjeta-credito',
    nombre: 'Tarjeta de Crédito',
    descripcion: 'Comodas cuotas y puntos por cada compra',
    icono: '💳',
    requisitos: 'RUT, historial crediticio'
  },
  {
    id: 'prestamo',
    nombre: 'Préstamo Personal',
    descripcion: 'Tasas preferenciales y aprobación rápida',
    icono: '💰',
    requisitos: 'RUT, antigüedad laboral'
  },
  {
    id: 'ahorros',
    nombre: 'Cuenta de Ahorros',
    descripcion: 'Ahorra con intereses competitivos',
    icono: '🏦',
    requisitos: 'RUT'
  }
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a Banco BCS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Solicita productos bancarios de forma rápida y segura
          </p>
        </section>

        {/* Productos section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nuestros Productos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="text-5xl mb-4">{producto.icono}</div>
                <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Requisitos:</strong> {producto.requisitos}
                </p>
                <Link
                  href="/solicitud/nueva"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full text-center"
                >
                  Iniciar Solicitud
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8" role="status">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
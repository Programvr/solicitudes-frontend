'use client';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div 
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" 
      role="alert"
      aria-live="polite"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
          aria-label="Reintentar"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
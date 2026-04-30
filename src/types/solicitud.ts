export interface DatosCliente {
  nombre: string;
  email: string;
  rut: string;
}

export interface Solicitud {
  _id: string;
  tipoProducto: string;
  estado: 'borrador' | 'en-proceso' | 'completada' | 'abandonada' | 'finalizada';
  datosCliente: DatosCliente;
  createdAt: string;
  updatedAt: string;
}

export interface CrearSolicitudDto {
  tipoProducto: string;
  datosCliente: DatosCliente;
}

export interface ActualizarSolicitudDto {
  tipoProducto?: string;
  datosCliente?: DatosCliente;
}
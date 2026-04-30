import axios from 'axios';
import { Solicitud, CrearSolicitudDto, ActualizarSolicitudDto } from '@/types/solicitud';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/solicitudes`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const solicitudApi = {
  // Crear solicitud
  crear: async (data: CrearSolicitudDto): Promise<Solicitud> => {
    const response = await api.post('/', data);
    return response.data;
  },

  // Obtener por ID
  obtenerPorId: async (id: string): Promise<Solicitud> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Actualizar solicitud
  actualizar: async (id: string, data: ActualizarSolicitudDto): Promise<Solicitud> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  // Cambiar estado
  cambiarEstado: async (id: string, estado: string): Promise<Solicitud> => {
    const response = await api.put(`/${id}/estado`, { estado });
    return response.data;
  },
};
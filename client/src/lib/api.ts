const BASE = import.meta.env.VITE_API_URL ?? '/api';

export type Servicio = {
  id: number;
  nombre: string;
  duracionMinutos: number;
  precio: number;
  activo: boolean;
};

export type Turno = {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  clienteNombre: string;
  clienteTelefono: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
  Servicio?: Servicio;
};

async function pedir<T>(path: string, opciones: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...opciones.headers },
  });
  const cuerpo = await res.json().catch(() => null);
  if (!res.ok) throw new Error(cuerpo?.error ?? `Error ${res.status}`);
  return cuerpo as T;
}

export const api = {
  servicios: () => pedir<Servicio[]>('/servicios'),

  disponibilidad: (servicioId: number, fecha: string) =>
    pedir<{ disponibles: string[] }>(`/disponibilidad?servicioId=${servicioId}&fecha=${fecha}`),

  crearTurno: (datos: { servicioId: number; fecha: string; horaInicio: string; clienteNombre: string; clienteTelefono: string }) =>
    pedir<Turno>('/turnos', { method: 'POST', body: JSON.stringify(datos) }),

  login: (username: string, password: string) =>
    pedir<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  adminTurnos: (token: string) =>
    pedir<Turno[]>('/admin/turnos', { headers: { Authorization: `Bearer ${token}` } }),

  actualizarEstadoTurno: (token: string, id: number, estado: Turno['estado']) =>
    pedir<Turno>(`/admin/turnos/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ estado }),
    }),
};

const TOKEN_KEY = 'turnos_admin_token';
export const sesion = {
  guardar: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  obtener: () => localStorage.getItem(TOKEN_KEY),
  borrar: () => localStorage.removeItem(TOKEN_KEY),
};

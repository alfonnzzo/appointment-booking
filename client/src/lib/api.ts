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

export type Usuario = { id: number; username: string };

async function pedir<T>(path: string, opciones: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opciones,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...opciones.headers },
  });
  if (res.status === 204) return undefined as T;
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
    pedir<Usuario>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  logout: () => pedir<void>('/auth/logout', { method: 'POST' }),

  me: () => pedir<Usuario>('/auth/me'),

  adminTurnos: () => pedir<Turno[]>('/admin/turnos'),

  actualizarEstadoTurno: (id: number, estado: Turno['estado']) =>
    pedir<Turno>(`/admin/turnos/${id}`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
};

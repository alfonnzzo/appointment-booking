import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, sesion, type Turno } from '../lib/api';

const ESTILO_ESTADO: Record<Turno['estado'], string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  confirmado: 'bg-emerald-100 text-emerald-800',
  cancelado: 'bg-slate-200 text-slate-500 line-through',
};

export default function AdminDashboard() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = sesion.obtener();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    cargar();
  }, []);

  function cargar() {
    api
      .adminTurnos(token!)
      .then(setTurnos)
      .catch((e) => {
        if (e.message.includes('Token')) {
          sesion.borrar();
          navigate('/admin/login');
        } else setError(e.message);
      });
  }

  async function cambiarEstado(id: number, estado: Turno['estado']) {
    await api.actualizarEstadoTurno(token!, id, estado);
    cargar();
  }

  function salir() {
    sesion.borrar();
    navigate('/admin/login');
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Turnos</h1>
        <button onClick={salir} className="text-sm text-slate-500 underline">
          Salir
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-2">
        {turnos.length === 0 && <p className="text-sm text-slate-400">No hay turnos próximos.</p>}
        {turnos.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-900">
                {t.fecha} · {t.horaInicio}–{t.horaFin} · {t.Servicio?.nombre}
              </p>
              <p className="text-sm text-slate-500">
                {t.clienteNombre} · {t.clienteTelefono}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded px-2 py-1 text-xs font-medium ${ESTILO_ESTADO[t.estado]}`}>{t.estado}</span>
              {t.estado !== 'confirmado' && (
                <button
                  onClick={() => cambiarEstado(t.id, 'confirmado')}
                  className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white"
                >
                  Confirmar
                </button>
              )}
              {t.estado !== 'cancelado' && (
                <button
                  onClick={() => cambiarEstado(t.id, 'cancelado')}
                  className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

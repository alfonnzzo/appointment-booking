import { useEffect, useState } from 'react';
import { api, type Servicio, type Turno } from '../lib/api';

const hoyISO = () => new Date().toISOString().slice(0, 10);

export default function Reservar() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState(hoyISO());
  const [disponibles, setDisponibles] = useState<string[]>([]);
  const [horaElegida, setHoraElegida] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnoCreado, setTurnoCreado] = useState<Turno | null>(null);

  useEffect(() => {
    api.servicios().then(setServicios).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setHoraElegida(null);
    if (!servicioId || !fecha) return setDisponibles([]);
    setCargando(true);
    api
      .disponibilidad(servicioId, fecha)
      .then((r) => setDisponibles(r.disponibles))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [servicioId, fecha]);

  async function confirmar() {
    if (!servicioId || !horaElegida) return;
    setError(null);
    setCargando(true);
    try {
      const turno = await api.crearTurno({ servicioId, fecha, horaInicio: horaElegida, clienteNombre: nombre, clienteTelefono: telefono });
      setTurnoCreado(turno);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  if (turnoCreado) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Turno reservado</h1>
        <p className="mt-3 text-slate-600">
          {turnoCreado.fecha} a las {turnoCreado.horaInicio}. Te esperamos — el negocio va a confirmar tu turno a la brevedad.
        </p>
      </div>
    );
  }

  const servicio = servicios.find((s) => s.id === servicioId);

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Reservar turno</h1>

      <label className="mt-6 block text-sm font-medium text-slate-700">Servicio</label>
      <select
        className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
        value={servicioId ?? ''}
        onChange={(e) => setServicioId(Number(e.target.value) || null)}
      >
        <option value="">Elegí un servicio</option>
        {servicios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre} — {s.duracionMinutos} min — ${s.precio}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-medium text-slate-700">Fecha</label>
      <input
        type="date"
        className="mt-1 w-full rounded-lg border border-slate-300 p-2.5"
        min={hoyISO()}
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      {servicioId && (
        <>
          <p className="mt-5 text-sm font-medium text-slate-700">Horarios disponibles</p>
          {cargando && <p className="mt-2 text-sm text-slate-400">Buscando horarios…</p>}
          {!cargando && disponibles.length === 0 && (
            <p className="mt-2 text-sm text-slate-400">No hay horarios libres ese día.</p>
          )}
          <div className="mt-2 grid grid-cols-4 gap-2">
            {disponibles.map((h) => (
              <button
                key={h}
                onClick={() => setHoraElegida(h)}
                className={`rounded-lg border p-2 text-sm ${
                  horaElegida === h ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-500'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </>
      )}

      {horaElegida && servicio && (
        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-600">
            {servicio.nombre} — {fecha} {horaElegida}hs
          </p>
          <input
            className="w-full rounded-lg border border-slate-300 p-2.5"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-300 p-2.5"
            placeholder="Tu teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <button
            disabled={cargando || nombre.trim().length < 2 || telefono.trim().length < 6}
            onClick={confirmar}
            className="w-full rounded-lg bg-slate-900 p-3 font-medium text-white disabled:opacity-40"
          >
            Confirmar reserva
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}

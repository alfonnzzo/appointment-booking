import { Op } from 'sequelize';
import Servicio from '../models/service.model.js';
import Turno from '../models/appointment.model.js';
import Bloqueo from '../models/block.model.js';
import { HORARIOS, INTERVALO_MINUTOS } from '../constants/horarios.js';

function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function aHHMM(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0');
  const m = String(minutos % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function seSuperponen(inicioA, finA, inicioB, finB) {
  return inicioA < finB && inicioB < finA;
}

function diaSemanaDeFecha(fechaISO) {
  const [year, month, day] = fechaISO.split('-').map(Number);
  return new Date(year, month - 1, day).getDay();
}

function calcularDisponibilidad({ fecha, duracionMinutos, ocupados = [], ahora = new Date() }) {
  const franjas = HORARIOS[diaSemanaDeFecha(fecha)] ?? [];
  const ocupadosMin = ocupados.map((o) => ({
    inicio: aMinutos(o.horaInicio),
    fin: aMinutos(o.horaFin),
  }));

  const hoyISO = ahora.toISOString().slice(0, 10);
  const minutoActual = hoyISO === fecha ? ahora.getHours() * 60 + ahora.getMinutes() : -1;

  const disponibles = [];
  for (const franja of franjas) {
    const inicioFranja = aMinutos(franja.inicio);
    const finFranja = aMinutos(franja.fin);
    for (let inicio = inicioFranja; inicio + duracionMinutos <= finFranja; inicio += INTERVALO_MINUTOS) {
      const fin = inicio + duracionMinutos;
      if (inicio <= minutoActual) continue;
      if (ocupadosMin.some((o) => seSuperponen(inicio, fin, o.inicio, o.fin))) continue;
      disponibles.push(aHHMM(inicio));
    }
  }
  return disponibles;
}

async function obtenerOcupados(fecha) {
  const [turnos, bloqueos] = await Promise.all([
    Turno.findAll({ where: { fecha, estado: { [Op.ne]: 'cancelado' } } }),
    Bloqueo.findAll({ where: { fecha } }),
  ]);
  return [...turnos, ...bloqueos].map((o) => ({ horaInicio: o.horaInicio, horaFin: o.horaFin }));
}

export async function listarServicios(_req, res) {
  try {
    const servicios = await Servicio.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function obtenerDisponibilidad(req, res) {
  try {
    const { servicioId, fecha } = req.query;
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio) return res.status(404).json({ error: 'Servicio inexistente.' });

    const ocupados = await obtenerOcupados(fecha);
    const disponibles = calcularDisponibilidad({ fecha, duracionMinutos: servicio.duracionMinutos, ocupados });
    res.json({ disponibles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function crearTurno(req, res) {
  try {
    const { servicioId, fecha, horaInicio, clienteNombre, clienteTelefono } = req.body;
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio || !servicio.activo) return res.status(404).json({ error: 'Servicio inexistente.' });


    const ocupados = await obtenerOcupados(fecha);
    const disponibles = calcularDisponibilidad({ fecha, duracionMinutos: servicio.duracionMinutos, ocupados });
    if (!disponibles.includes(horaInicio)) {
      return res.status(409).json({ error: 'Ese horario ya no está disponible. Elegí otro.' });
    }

    const [h, m] = horaInicio.split(':').map(Number);
    const finMinutos = h * 60 + m + servicio.duracionMinutos;
    const horaFin = `${String(Math.floor(finMinutos / 60)).padStart(2, '0')}:${String(finMinutos % 60).padStart(2, '0')}`;

    const turno = await Turno.create({
      servicioId,
      fecha,
      horaInicio,
      horaFin,
      clienteNombre,
      clienteTelefono,
      estado: 'pendiente',
    });
    res.status(201).json(turno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

import { Op } from 'sequelize';
import Servicio from '../models/service.model.js';
import Turno from '../models/appointment.model.js';
import Bloqueo from '../models/block.model.js';

export async function listarTurnos(req, res) {
  try {
    const desde = req.query.desde ?? new Date().toISOString().slice(0, 10);
    const turnos = await Turno.findAll({
      where: { fecha: { [Op.gte]: desde } },
      include: Servicio,
      order: [['fecha', 'ASC'], ['horaInicio', 'ASC']],
    });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function actualizarEstadoTurno(req, res) {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno inexistente.' });
    turno.estado = req.body.estado;
    await turno.save();
    res.json(turno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listarServicios(_req, res) {
  try {
    res.json(await Servicio.findAll({ order: [['nombre', 'ASC']] }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function crearServicio(req, res) {
  try {
    res.status(201).json(await Servicio.create(req.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function actualizarServicio(req, res) {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio inexistente.' });
    await servicio.update(req.body);
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listarBloqueos(req, res) {
  try {
    const desde = req.query.desde ?? new Date().toISOString().slice(0, 10);
    res.json(await Bloqueo.findAll({ where: { fecha: { [Op.gte]: desde } }, order: [['fecha', 'ASC']] }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function crearBloqueo(req, res) {
  try {
    res.status(201).json(await Bloqueo.create(req.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function borrarBloqueo(req, res) {
  try {
    const borrado = await Bloqueo.destroy({ where: { id: req.params.id } });
    if (!borrado) return res.status(404).json({ error: 'Bloqueo inexistente.' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

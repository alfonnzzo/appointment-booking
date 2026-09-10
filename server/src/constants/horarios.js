// Horario de atención del negocio. 0 = domingo ... 6 = sábado.
// ponytail: horario fijo en archivo, no tabla editable desde el panel — el dueño
// de un negocio cambia su horario pocas veces al año. Si eso deja de ser cierto,
// pasar esto a una tabla Horario con CRUD en el admin.
export const HORARIOS = {
  1: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], // lunes
  2: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }],
  3: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }],
  4: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }],
  5: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], // viernes
  6: [{ inicio: '09:00', fin: '13:00' }], // sábado
  0: [], // domingo cerrado
};

export const INTERVALO_MINUTOS = 30;

export const HORA_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

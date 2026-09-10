git init# Sistema de turnos para negocios locales

Reserva de turnos online (peluquería, consultorio, gimnasio, etc.) con panel de administración para el dueño del negocio.

- **Cliente**: elige un servicio, ve los horarios realmente libres ese día y reserva con nombre y teléfono.
- **Dueño del negocio**: inicia sesión, ve los turnos, los confirma o cancela.

## Stack

- Backend: Node.js, Express, Sequelize, JWT, Express Validator.
- Base de datos: SQLite en desarrollo (cero instalación), Postgres en producción — mismo código, cambia solo una variable de entorno.
- Frontend: React, TypeScript, Tailwind CSS v4, React Router.

## Correr en local

```bash
# Backend
cd server
cp .env.example .env
npm install
npm run seed   # crea servicios de ejemplo y el usuario admin (ver output para la contraseña)
npm run dev    # http://localhost:4000

# Frontend (en otra terminal)
cd client
npm install
npm run dev    # http://localhost:5173
```

El frontend está configurado para reenviar `/api` al backend en el puerto 4000 (ver `client/vite.config.ts`), así que en desarrollo no hace falta tocar nada más.

## Pasar a Postgres para producción

1. Crear una base Postgres gratuita (Neon, Supabase o Render).
2. En el `.env` del servidor, completar `DATABASE_URL` con la cadena de conexión (y `DATABASE_SSL=true` si el proveedor lo exige).
3. Nada más cambia: Sequelize usa el mismo modelo de datos en los dos motores.

## Qué le falta para ser un producto (no un portafolio)

- Horario de atención hoy es un archivo fijo (`server/src/config/horarios.js`). Pasarlo a una tabla editable desde el panel si un negocio necesita cambiarlo seguido.
- No envía email ni WhatsApp de confirmación al cliente — hoy la confirmación es visual, dentro del panel.
- Un solo negocio, un solo usuario administrador. Para multi-negocio hace falta un modelo `Negocio` y aislar los datos por negocio.

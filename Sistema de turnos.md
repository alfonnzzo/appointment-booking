---
tags:
  - proyecto
---

# Sistema de turnos

Reserva de turnos online para un negocio local (peluquería, consultorio, gimnasio) con panel de administración para el dueño. Proyecto de portafolio para mostrar en Workana, no un trabajo de la cursada ni un pedido de un cliente real.

## Qué hace

El cliente elige un servicio, ve los horarios realmente libres ese día — cruzando horario de atención, turnos ya tomados y bloqueos — y reserva con nombre y teléfono. El dueño entra al panel, ve los turnos y los confirma o cancela.

## Stack

Node.js, Express, Sequelize, JWT, Express Validator. React, TypeScript, Tailwind CSS v4, React Router. SQLite en desarrollo, Postgres en producción — mismo código, cambia una variable de entorno.

## Dónde está el código

| Frente | Ruta | Estado |
| --- | --- | --- |
| Backend + frontend | `03 - Proyectos/sistema-turnos/` (dentro de esta bóveda) | Funcional en local, sin desplegar |

Corre en local: ver `README.md` en la carpeta del proyecto.

## Pendiente

- Desplegar con una URL pública (frontend en Vercel/Netlify, backend en Render/Railway, base en Neon/Supabase) antes de mostrarlo en el perfil de Workana.
- Horario de atención hoy es un archivo fijo, no editable desde el panel.
- Ideas 2 y 3 del portafolio (catálogo con pedido por WhatsApp, app de stock) siguen pendientes de empezar.

## Enlaces

- [[Proyectos]]

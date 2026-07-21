# Prun MVP v1 Backend

Backend oficial de Prun MVP v1, una aplicación móvil de paseos monitoreados para perros.

## Stack

- Node.js 20.19.4
- Express
- MongoDB 6.0.20
- Mongoose
- JWT
- Socket.IO

## Requisitos

- Node.js 20.19.4
- MongoDB 6.0.20
- npm
- curl
- jq

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env` tomando como base:

```bash
cp .env.example .env
```

Variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/prun_mvp_v1
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8081
```

## Scripts

```bash
npm run dev
npm start
npm run seed
npm run smoke
```

## Flujo de desarrollo recomendado

Primero cargar datos demo:

```bash
npm run seed
```

Después levantar el backend:

```bash
npm run dev
```

En otra terminal ejecutar:

```bash
npm run smoke
```

## Usuarios demo

| Rol | Email | Password |
|---|---|---|
| PROWNER | victor@example.com | 123456 |
| PROWNER | laura@example.com | 123456 |
| PRUNNER | hugo@example.com | 123456 |
| PRUNNER | carlos@example.com | 123456 |

## Módulos principales

- Auth
- Users
- Dogs
- Walks
- Tracking GPS
- Tracking live con Socket.IO
- Photos
- Summary
- Ratings
- Service Area
- Matching geográfico
- Dashboards

## Endpoints principales

### Core

```http
GET /api/health
```

### Auth

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users

```http
GET /api/users/me
PUT /api/users/me
GET /api/users/me/service-area
PUT /api/users/me/service-area
```

### Dogs

```http
POST   /api/dogs
GET    /api/dogs
GET    /api/dogs/:dogId
PUT    /api/dogs/:dogId
DELETE /api/dogs/:dogId
```

### Walks

```http
POST /api/walks
GET  /api/walks
GET  /api/walks/:walkId

POST /api/walks/:walkId/accept
POST /api/walks/:walkId/start
POST /api/walks/:walkId/complete
POST /api/walks/:walkId/summary
```

### Tracking

```http
POST /api/walks/:walkId/tracking
GET  /api/walks/:walkId/tracking
```

### Photos

```http
POST /api/walks/:walkId/photos
GET  /api/walks/:walkId/photos
```

### Ratings

```http
POST /api/walks/:walkId/rating
GET  /api/prunners/:prunnerId/rating
```

### Dashboards

```http
GET /api/dashboard/prowner
GET /api/dashboard/prunner
```

## Socket.IO

Rooms:

```text
walk:<walkId>
```

Eventos:

```text
walk:join
walk:leave
walk:tracking:new-point
```

El tracking se guarda primero mediante REST y después se emite por Socket.IO. La persistencia no depende de que haya un cliente conectado.

## Estados del paseo

```text
requested
accepted
in_progress
completed
cancelled
```

## Reglas principales

- Solo un PROWNER administra sus perros.
- Solo un PROWNER crea solicitudes de paseo.
- Solo un PRUNNER acepta, inicia y completa paseos.
- Un PRUNNER puede tener como máximo dos asignaciones activas.
- El tracking solo puede enviarse durante un paseo activo.
- Los paseos disponibles se filtran por ubicación y radio.
- Un paseo completado solo puede calificarse una vez.

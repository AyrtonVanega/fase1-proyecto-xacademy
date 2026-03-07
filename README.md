# ⚽️ FIFA Players App Proyecto XAcademy

Aplicación fullstack para gestionar jugadores de FIFA.  
Permite listar, filtrar, crear, editar, importar/exportar y analizar jugadores con gráficos interactivos.
> En la carpeta `docs/` se incluye un ejemplo de archivo CSV para importar jugadores.

---

# 🏗️ Tecnologías utilizadas

- **Backend:** Node.js + Express  
- **Frontend:** Angular  
- **Base de Datos:** MySQL  
- **ORM:** Sequelize  
- **Cliente SQL:** DBeaver
- **Contenedores:** Docker + Docker Compose

---

# 🧩 Arquitectura

El backend sigue una arquitectura en capas:

Controllers → Services → Providers → Models

Además se utilizan:

- DTOs para transferencia de datos
- Mappers para transformación de entidades
- Middleware para autenticación JWT

---

# 📂 **Estructura del Proyecto**

## Backend:

```
config/
middleware/
controllers/
services/
providers/
models/
dtos/
mappers/
routes/
utils/
```

## Frontend:

```
config/
components/
services/
models/
factories/
guards/
```

---

# 🚀 Cómo levantar el proyecto

El proyecto se encuentra completamente dockerizado, por lo que no requiere configuraciones manuales adicionales para su ejecución básica.

## 🔧 Requisitos previos
- Docker
- Docker Compose

---

# ▶️ Ejecución

Desde la raíz del proyecto, ejecutar:

```
docker compose up --build
```

Esto levantará los siguientes servicios:

- Backend
- Frontend
- MySQL

---

# 🌐 Acceso a la aplicación

Una vez levantado el proyecto:

- Frontend: http://localhost:4200

- Backend API: http://localhost:3000

---

# 🔐 Autenticación

Para utilizar la aplicación es necesario iniciar sesión.

Credenciales de prueba:

* Usuario: usuario
* Contraseña: 1234

---

# 🔄 Flujo de la aplicación

1. El backend expone los endpoints bajo `/api`
2. El frontend consume estos endpoints para:

* Loguear usuarios
* Listar jugadores
* Filtrar por versión FIFA, club, nacionalidad, etc.
* Crear y Editar jugadores
* Mostrar gráficos de estadísticas
* Importar y exportar jugadores mediante CSV/XLSX

> Las rutas de `/api/players` requieren autenticación mediante token JWT.

---

# 🧪 Endpoints

## Autenticación

| Método | Endpoint | Descripción |
|------|------|------|
| POST | `/api/auth/login` | Inicia sesión y devuelve un JWT |

## Jugadores

| Método | Endpoint | Descripción |
|------|------|------|
| GET | `/api/players` | Listar jugadores con filtros |
| GET | `/api/players/export` | Exportar jugadores filtrados |
| GET | `/api/players/:id` | Buscar jugador por ID |
| GET | `/api/players/:id/skills/timeline` | Evolución de habilidades |
| POST | `/api/players/import` | Importar jugadores desde CSV |
| POST | `/api/players` | Crear jugador |
| PUT | `/api/players/:id` | Actualizar jugador |


# 👨‍💻 Autor

**Ayrton Vanega**
# ⚽️ FIFA Players App Proyecto XAcademy

Aplicación fullstack para gestionar jugadores de FIFA.  
Permite listar, filtrar, crear, editar y analizar jugadores con gráficos interactivos.

---

## 🚀 Tecnologías utilizadas

- **Backend:** Node.js + Express + Sequelize  
- **Frontend:** Angular  
- **Base de Datos:** MySQL  
- **ORM:** Sequelize  
- **Cliente SQL:** DBeaver

---

## ⚙️ Requisitos previos

Tecnologias necesarias para ejecutar la app

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/)
- [MySQL Server](https://dev.mysql.com/downloads/)
- [Angular CLI](https://angular.io/cli)
- (Opcional) [DBeaver](https://dbeaver.io/) para administrar la base de datos

---

## 🧩 Configuración de la base de datos

1. Iniciá tu servidor MySQL
2. Abrí **DBeaver** o una consola MySQL
3. Ejecutá el archivo `fifa_local.sql`:


Esto creará la base `fifa_local` y cargará los datos iniciales.

---

## 🛠️ Configuración del Backend

1. Entrá en la carpeta del backend
2. Instalá las dependencias (npm install)
3. Configurá las variables de conexión en el archivo `.env`
4. Iniciá el servidor (npm run dev)

---

## 💻 Configuración del Frontend

1. Entrá en la carpeta del frontend
2. Instalá las dependencias (npm install)
3. Iniciá la aplicación (npm start / ng serve)
4. Abrí el navegador en:
[http://localhost:4200](http://localhost:4200)

---

## 🔐 Log in

Datos para loguearse en la app:

* Usuario: usuario
* Contraseña: 1234

---

## 🔄 Flujo de la aplicación

1. El backend expone los endpoints en `api/players`
2. El frontend consume estos endpoints para:

* Listar jugadores
* Filtrar por versión FIFA, club, nacionalidad, etc.
* Crear y Editar jugadores
* Mostrar gráficos de estadísticas

---

## 🧪 Endpoints

| Método | Endpoint              | Descripción                     |
| :----: | :-------------------- | :------------------------------ |
|   GET  | `/api/players`        | Listar jugadores con filtros    |
|   GET  | `/api/players/export` | Exporta los jugadores filtrados |
|   GET  | `/api/players/:id`    | Buscar jugador por ID           |
|  POST  | `/api/players`        | Crear jugador                   |
|   PUT  | `/api/players/:id`    | Actualizar jugador              |
|   GET  | `/api/players/login`  | Loguea un usuario               |


## 👨‍💻 Autor

**Ayrton Vanega**
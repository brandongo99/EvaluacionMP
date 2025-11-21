# Proyecto DICRI - Evaluación MP

Este proyecto consiste en una aplicación **Full Stack** para la gestión de expedientes e indicios, desarrollada con:

- **Frontend:** React.js + Bootstrap
- **Backend:** Node.js + Express + SQL Server
- **Base de datos:** SQL Server
- **Autenticación:** JWT (Access Token + Refresh Token)
- **Cache / Blacklist:** Redis
- **Contenedores:** Docker

---

## Estructura del Proyecto
EvaluacionMP/
├── docker-compose.yml        # Configuración de contenedores
├── frontend/                 # Aplicación React.js
├── dicri_api/                # API Backend con Express
├── database/                 # Scripts SQL (Tablas, SP, Inserts)
└── Documentación/            # Manual técnico y diagramas
---

## Requisitos Previos

- Node.js (v18+)
- Docker Desktop
- Visual Studio Code
- Extensión **Docker** en VS Code

---

## Instalación del Proyecto

### **Frontend**
npm install react-router-dom
npm install react-bootstrap bootstrap
npm install --save react-top-loading-bar
npm install axios
npm install date-fns --save
npm install --save sweetalert2 sweetalert2-react-content

### **Backend**
cd dicri_api
npm init -y
npm install express cors dotenv jsonwebtoken mssql bcrypt swagger-ui-express swagger-jsdoc redis
npm install --save-dev nodemon

## Agregar script en package.json:
"scripts": {
  "dev": "nodemon index.js"
}

### **Base de Datos** ##
En la carpeta database encontrarás:

Tablas.sql → Creación de tablas
SP.sql → Procedimientos almacenados
InsertarDatos.sql → Datos iniciales
Usuarios.sql → Usuarios para autenticación

### **Configuración Docker** ###
El archivo docker-compose.yml levanta los siguientes servicios:

SQL Server → Puerto 1433
Redis → Puerto 6379
Backend (Express) → Puerto 3000
Frontend (React) → Puerto 5173

## Levantar contenedores
Desde la raíz del proyecto:
Shelldocker-compose up -dMostrar más líneas
Para verificar:
Shelldocker psMostrar más líneas

## Ejecutar desde Visual Studio Code

Instala la extensión Docker en VS Code.
Abre la carpeta raíz del proyecto.
Haz clic en la pestaña Docker en la barra lateral.
Selecciona docker-compose.yml y elige Up.
Espera a que los contenedores estén en ejecución.

### **Autenticación** ###

Login: Contraseña encriptada con Bcrypt.
Access Token: Expira en 15 minutos.
Refresh Token: Expira en 7 días.
Blacklist: Implementada en Redis para logout.
Renovación automática: Interceptor Axios en el frontend.

### **Documentación** ###
En la carpeta Documentación encontrarás:

Manual Técnico (PDF y DOCX)
Manual de Usuario (PDF y DOCX)
Diagramas de Arquitectura
Diagrama ERD (SQL Server)

### **Comandos útiles** ###
Iniciar backend:
cd dicri_api
npm run dev

Iniciar frontend:
cd frontend
npm run dev

 Autor
Evaluación MP - Proyecto DICRI - Brandon Eduardo Godinez
Desarrollado con React.js, Express, SQL Server y Docker.

---

Este README incluye:
- Estructura del proyecto
- Dependencias con comandos exactos
- Pasos para levantar **Docker** desde VS Code
- Información sobre autenticación y documentación


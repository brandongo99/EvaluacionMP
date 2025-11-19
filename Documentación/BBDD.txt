DROP DATABASE DICRI;
CREATE DATABASE DICRI;

CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(100),
    rol VARCHAR(20), -- 'Tecnico' o 'Coordinador'
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255)
);

CREATE TABLE Expediente (
    id_expediente INT PRIMARY KEY IDENTITY,
    numero_expediente VARCHAR(50),
    fecha_registro DATETIME,
    estado VARCHAR(20), -- 'Registrado', 'En revisión', 'Aprobado', 'Rechazado'
    justificacion_rechazo VARCHAR(255) NULL,
    id_tecnico INT FOREIGN KEY REFERENCES Usuario(id_usuario)
);

CREATE TABLE Indicio (
    id_indicio INT PRIMARY KEY IDENTITY,
    descripcion VARCHAR(255),
    color VARCHAR(50),
    tamano VARCHAR(50),
    peso DECIMAL(10,2),
    ubicacion VARCHAR(255),
    id_expediente INT FOREIGN KEY REFERENCES Expediente(id_expediente),
    id_tecnico INT FOREIGN KEY REFERENCES Usuario(id_usuario)
);

CREATE TABLE Revision (
    id_revision INT PRIMARY KEY IDENTITY,
    id_expediente INT FOREIGN KEY REFERENCES Expediente(id_expediente),
    id_coordinador INT FOREIGN KEY REFERENCES Usuario(id_usuario),
    fecha_revision DATETIME,
    resultado VARCHAR(20), -- 'Aprobado' o 'Rechazado'
    justificacion VARCHAR(255) NULL
);
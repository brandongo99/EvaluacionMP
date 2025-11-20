INSERT INTO Rol (nombre_rol) VALUES ('Tecnico');
INSERT INTO Rol (nombre_rol) VALUES ('Coordinador');

INSERT INTO Usuario (nombre, correo, contrasena, id_rol)
VALUES ('Tecnico Uno', 'tecnico1@dicri.gob.gt', '12345', 1);

INSERT INTO Usuario (nombre, correo, contrasena, id_rol)
VALUES ('Coordinador Uno', 'coor1@dicri.gob.gt', '12345', 2);

UPDATE Usuario SET contrasena = '$2b$10$2UnPO/BcN8dZNAQ16TY4/OuO6DKoFfcadLbwGXERv9eOr8YAO7l6a' -- 12345

SELECT * FROM Usuario
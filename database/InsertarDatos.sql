INSERT INTO Rol (nombre_rol) VALUES ('Tecnico');
INSERT INTO Rol (nombre_rol) VALUES ('Coordinador');

INSERT INTO Usuario (nombre, correo, contrasena, id_rol)
VALUES ('Tecnico Uno', 'tecnico1@dicri.gob.gt', '12345', 1);

INSERT INTO Usuario (nombre, correo, contrasena, id_rol)
VALUES ('Coordinador Uno', 'coor1@dicri.gob.gt', '12345', 2);

UPDATE Usuario SET contrasena = '$2b$10$gFPKnDBbCTQHv0YNCM5BGue.Y.vekNugVrp3yfGJuB3BHzYRVygFG' -- 12345

SELECT * FROM Usuario
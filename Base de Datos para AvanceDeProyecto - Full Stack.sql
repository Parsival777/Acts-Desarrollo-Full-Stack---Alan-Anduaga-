CREATE DATABASE taller_db;
USE taller_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE reparaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo VARCHAR(100),
    descripcion VARCHAR(255)
);

USE taller_db;

TRUNCATE TABLE reparaciones;

ALTER TABLE reparaciones
ADD COLUMN usuario_id INT;
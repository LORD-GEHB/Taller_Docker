USE taller;

CREATE TABLE USUARIOS (
    nombre VARCHAR(255) NOT NULL,
    edad INTEGER NOT NULL,
    correo VARCHAR(255) NOT NULL,
    carnet INTEGER NOT NULL,
    PRIMARY KEY (carnet)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'taller';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'taller';

GRANT ALL PRIVILEGES ON taller.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON taller.* TO 'root'@'%';

FLUSH PRIVILEGES;
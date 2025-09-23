# Taller_Docker
Taller de aplicación Cliente-Servidor en Docker

## Descripción

Este taller tiene como objetivo enseñar la creación y contenerización de una aplicación Cliente-Servidor completa utilizando tecnologías modernas de desarrollo web y Docker.

## Tecnologías Utilizadas

- **⚛️ Frontend**: Next.js - Framework de React para el desarrollo de la interfaz de usuario
- **🚀 Backend**: Express.js - Framework de Node.js para la creación de la API REST
- **🗄️ Base de Datos**: MySQL - Sistema de gestión de base de datos relacional
- **🐳 Contenerización**: Docker - Para empaquetar y desplegar la aplicación
- **📦 Registro**: Docker Hub - Para almacenar y distribuir las imágenes de contenedores

## Prerrequisitos

### Instalaciones Necesarias

1. **Node.js**: [Descargar Node.js](https://nodejs.org/en/download)
2. **Docker Engine**: [Instalar Docker Engine](https://docs.docker.com/engine/install/)
3. **Docker Desktop**: [Instalar Docker Desktop](https://docs.docker.com/desktop/setup/install/linux/)

### Comandos de Instalación

```bash
# Crear proyecto Next.js
npx create-next-app@latest mi-frontend

# Instalar Express.js en un nuevo proyecto
npm init -y
npm install express
```

## Comandos Esenciales de Docker

```bash
# Gestión de contenedores
docker start <container_name>     # Iniciar contenedor
docker ps -a                      # Listar todos los contenedores
docker stop <container_name>      # Detener contenedor
docker rm <container_name>        # Eliminar contenedor

# Gestión de imágenes
docker images                     # Listar imágenes
docker rmi <image_name>          # Eliminar imagen

# Gestión de volúmenes
docker volume ls                  # Listar volúmenes

# Docker Compose
docker compose up                 # Levantar servicios
docker compose down              # Detener servicios
```

## Comandos para Ejecutar los Servicios

### Base de Datos (MySQL)

```bash
# Crear volumen para persistencia de datos
docker volume create mysql-data

# Ejecutar contenedor de base de datos
docker run -d \
  --name DB_TALLER \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=taller \
  -e MYSQL_DATABASE=taller \
  -v mysql-data:/var/lib/mysql \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -v $(pwd)/database/mysql-config/auth.cnf:/etc/mysql/conf.d/auth.cnf \
  mysql_taller:latest \
  --default-authentication-plugin=mysql_native_password
```

**Nota**: Las siguientes configuraciones son opcionales ya que pueden estar definidas en archivos de configuración:
- `-e MYSQL_ROOT_PASSWORD=taller`
- `-e MYSQL_DATABASE=taller`
- `--default-authentication-plugin=mysql_native_password`

### API (Backend)

```bash
# Ejecutar contenedor de la API
docker run -d \
  --name API_TALLER \
  -p 3001:3001 \
  api_taller:latest
```

### Frontend

```bash
# Ejecutar contenedor del frontend
docker run -d \
  --name FRONTEND_TALLER \
  -p 3000:3000 \
  frontend_taller:latest
```

## Comandos Adicionales de Docker

```bash
# Acceder a terminal de contenedor
docker exec -it <nombre_contenedor> /bin/bash

# Docker Compose - Comandos completos
docker compose build             # Construir imágenes
docker compose up               # Levantar servicios
docker compose stop             # Detener servicios
docker compose down             # Detener y eliminar servicios

# Gestión de imágenes en Docker Hub
docker tag <local-image:tagname> <user/repo:tagname>
docker push <user/repo:tagname>
```

## Objetivos

- Desarrollar una aplicación CRUD (Create, Read, Update, Delete) completa
- Implementar una arquitectura Cliente-Servidor bien estructurada
- Contenerizar cada componente de la aplicación usando Docker
- Crear archivos Dockerfile para cada servicio
- Configurar Docker Compose para orquestar múltiples contenedores
- Publicar las imágenes en Docker Hub para su distribución

## Estructura del Proyecto

El taller cubrirá la creación de:
- Una aplicación frontend interactiva con Next.js
- Una API RESTful robusta con Express.js
- Una base de datos MySQL configurada
- Contenedores Docker para cada componente
- Configuración de red entre contenedores
- Deployment y publicación en Docker Hub

## Documentación Oficial

- 📚 [Documentación de Docker](https://docs.docker.com/manuals/)
- 📗 [Documentación de Node.js](https://nodejs.org/docs/latest/api/)
- ⚛️ [Documentación de Next.js](https://nextjs.org/docs)

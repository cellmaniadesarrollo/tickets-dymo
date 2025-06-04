# Usa una imagen base oficial reciente de Node.js
FROM node:22-alpine

# Crea el directorio de la app dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm install --omit=dev

# Copia todo el código del proyecto
COPY . .

# Expone el puerto que usa tu app
EXPOSE 5000

# Comando para ejecutar el servidor
CMD ["node", "src/index.js"]

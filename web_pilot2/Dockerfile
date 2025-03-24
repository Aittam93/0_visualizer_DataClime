# Dockerfile
FROM node:16-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Esponi la porta utilizzata dall'applicazione
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["npm", "start"]
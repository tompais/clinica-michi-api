# La lista del maletín: cómo se arma la imagen de la API.
FROM oven/bun:1
WORKDIR /app

# Primero las dependencias, así Docker reusa esta capa si no cambiaron.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# Después el código. Bun corre TypeScript directo, sin compilar.
COPY tsconfig.json ./
COPY src ./src

ENV PORT=8080
EXPOSE 8080

# Una imagen, varios papeles: con ROL=api levanta la API y con ROL=job-recordatorios corre el job.
CMD ["bun", "src/main.ts"]

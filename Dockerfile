# Estágio 1: Build da aplicação Angular
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências aproveitando cache de camadas do Docker
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia apenas o código e realiza o build de produção
COPY . .
RUN npm run build -- --configuration production

# Estágio 2: Servidor Nginx para os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist/orcamento-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

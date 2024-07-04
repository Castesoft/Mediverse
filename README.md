### Creación de migraciones

```bash
cd /c/Projects/Mediverse/

# Sqlite Migration for MainService
dotnet ef migrations add InitialCreate --startup-project ./src/MainService --project ./src/Migrations/MainService.Sqlite -- --provider Sqlite
# Postgres Migration for MainService
dotnet ef migrations add InitialCreate --startup-project ./src/MainService --project ./src/Migrations/MainService.Postgres -- --provider Postgres

cd /c/Projects/Mediverse/ && rm -fR /c/Projects/Mediverse/src/Migrations/MainService.Postgres/Migrations && rm -fR /c/Projects/Mediverse/src/Migrations/MainService.Sqlite/Migrations && dotnet ef migrations add InitialCreate --startup-project ./src/MainService --project ./src/Migrations/MainService.Postgres -- --provider Postgres && dotnet ef migrations add InitialCreate --startup-project ./src/MainService --project ./src/Migrations/MainService.Sqlite -- --provider Sqlite
```

### Correr con distintos proveedores de base de datos

```bash
# MainService con Sqlite
cd /c/Projects/Mediverse/src/MainService/
dotnet watch --no-hot-reload -- --provider Sqlite

# MainService con Postgres
cd /c/Projects/Mediverse/src/MainService/
dotnet watch --no-hot-reload -- --provider Postgres
```

### Reset Sqlite Database

```bash
rm -f /c/Projects/Mediverse/src/MainService/mediverse.db
rm -f /c/Projects/Mediverse/src/MainService/mediverse.db-shm
rm -f /c/Projects/Mediverse/src/MainService/mediverse.db-wal

rm -f /c/Projects/Mediverse/src/MainService/mediverse.db && rm -f /c/Projects/Mediverse/src/MainService/mediverse.db-shm && rm -f /c/Projects/Mediverse/src/MainService/mediverse.db-wal

rm -f /c/Projects/Mediverse/frontend/web-app/ssl/localhost-key.pem && rm -f /c/Projects/Mediverse/frontend/web-app/ssl/localhost.pem && cd /c/Projects/Mediverse/frontend/web-app/ssl/ && mkcert localhost


```

### Reference `docker-compose.yml` file

```yml
version: '2'

services:

  postgres:
    image: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespw
    ports:
      - 5432:5432
    volumes:
      - pg-data:/var/lib/postresql/data

  dgb:
    image: ramirocaste/dgb:latest
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:80
      - ConnectionStrings__Sqlite=Data source=app.db
      - ConnectionStrings__Postgres=Server=postgres:5432;User Id=postgres;Password=postgrespw;Database=app
      - TokenSettings__Key=thiskeyisthemostsecretthingyoucanimagineandthatisbecauseivejustdecidedthatcanyoubelieveme   
      - TokenSettings__Issuer=https://beta.dgb.castesoft.com
      - VIRTUAL_HOST=beta.dgb.castesoft.com
      - LETSENCRYPT_HOST=beta.dgb.castesoft.com
    ports:
      - 7001:80
    depends_on:
      - postgres

  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - 80:80
      - 443:443
    volumes:
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - certs:/etc/nginx/certs:ro
      - /var/run/docker.sock:/tmp/docker.sock:ro
  acme-companion:
    image: nginxproxy/acme-companion
    container_name: nginx-proxy-acme
    environment:
      - DEFAULT_EMAIL=rcastellanos@castesoft.com
    volumes_from:
      - nginx-proxy
    volumes:
      - certs:/etc/nginx/certs:rw
      - acme:/etc/acme.sh
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  pg-data:
  conf:
  vhost:
  html:
  certs:
  acme:
```

### `docker-compose.yml` file for Mediverse

```yml
version: '2'

services:

  postgres:
    image: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespw
    ports:
      - 5432:5432
    volumes:
      - pg-data:/var/lib/postresql/data

  mediverse:
    image: ramirocaste/mediverse:latest
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:80
      - ConnectionStrings__Sqlite=Data source=mediverse.db
      - ConnectionStrings__Postgres=Server=postgres:5432;User Id=postgres;Password=postgrespw;Database=mediverse
      - TokenSettings__Key=thiskeyisthemostsecretthingyoucanimagineandthatisbecauseivejustdecidedthatcanyoubelieveme   
      - TokenSettings__Issuer=https://beta.mediverse.castesoft.com
      - VIRTUAL_HOST=beta.mediverse.castesoft.com
      - LETSENCRYPT_HOST=beta.mediverse.castesoft.com
    ports:
      - 7401:80
    depends_on:
      - postgres

  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - 80:80
      - 443:443
    volumes:
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - certs:/etc/nginx/certs:ro
      - /var/run/docker.sock:/tmp/docker.sock:ro
  acme-companion:
    image: nginxproxy/acme-companion
    container_name: nginx-proxy-acme
    environment:
      - DEFAULT_EMAIL=rcastellanos@castesoft.com
    volumes_from:
      - nginx-proxy
    volumes:
      - certs:/etc/nginx/certs:rw
      - acme:/etc/acme.sh
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  pg-data:
  conf:
  vhost:
  html:
  certs:
  acme:
```

### Creación de migraciones

```bash
cd /c/Projects/Mediverse/

# Sqlite Migration for MainService
dotnet ef migrations add InitialCreate --startup-project ./src/MainService --project ./src/Migrations/MainService.Sqlite -- --provider Sqlite
# Postgres Migration for MainService
dotnet ef migrations add InitialCreate --startup-project ./src/MainService --project ./src/Migrations/MainService.Postgres -- --provider Postgres
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


```

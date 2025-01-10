FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app
EXPOSE 80

COPY Mediverse.sln Mediverse.sln
COPY src/MainService/MainService.csproj src/MainService/MainService.csproj
COPY src/MainService.Models/MainService.Models.csproj src/MainService.Models/MainService.Models.csproj
COPY src/Migrations/MainService.Postgres/MainService.Postgres.csproj src/Migrations/MainService.Postgres/MainService.Postgres.csproj
COPY src/Migrations/MainService.Sqlite/MainService.Sqlite.csproj src/Migrations/MainService.Sqlite/MainService.Sqlite.csproj
COPY src/MainService.Core/MainService.Core.csproj src/MainService.Core/MainService.Core.csproj
COPY src/MainService.Infrastructure/MainService.Infrastructure.csproj src/MainService.Infrastructure/MainService.Infrastructure.csproj

RUN dotnet restore Mediverse.sln

COPY src/MainService src/MainService
COPY src/MainService.Models src/MainService.Models
COPY src/Migrations/MainService.Postgres src/Migrations/MainService.Postgres
COPY src/Migrations/MainService.Sqlite src/Migrations/MainService.Sqlite
COPY src/MainService.Core src/MainService.Core
COPY src/MainService.Infrastructure src/MainService.Infrastructure
WORKDIR /app/src/MainService
RUN dotnet publish -c Release -o /app/src/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT [ "dotnet", "MainService.dll" ]
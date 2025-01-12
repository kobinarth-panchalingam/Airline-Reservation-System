FROM postgres:alpine
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=airline

# The PostgreSQL image will automatically execute any .sql files in this directory to initialize the database when the container starts.
COPY bairways_postgres.sql /docker-entrypoint-initdb.d/bairways_postgres.sql
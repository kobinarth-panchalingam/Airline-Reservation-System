FROM postgres:alpine
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=airline

# The PostgreSQL image will automatically execute any .sql files in this directory to initialize the database when the container starts.
# Also note that the scripts will be executed in alphabetical order, so it is important to name the scripts accordingly.
COPY bairways_postgres.sql dummy_data.sql /docker-entrypoint-initdb.d/
FROM flyway/flyway

COPY ./migrations/*.sql /flyway/sql/
COPY ./migrations/custom-entrypoint.sh /flyway/custom-entrypoint.sh
RUN chmod +x /flyway/custom-entrypoint.sh

ENTRYPOINT ["custom-entrypoint.sh"]
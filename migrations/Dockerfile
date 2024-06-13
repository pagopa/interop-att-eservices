FROM flyway/flyway

COPY *.sql /flyway/sql/
COPY custom-entrypoint.sh /flyway/custom-entrypoint.sh
RUN chmod +x /flyway/custom-entrypoint.sh

ENTRYPOINT ["custom-entrypoint.sh"]
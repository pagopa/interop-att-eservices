#!/bin/bash

# replace USER_PASSWORD env in sql scripts
find /flyway/sql/ -type f -name "*.sql" -exec sed -i "s/{{USER_PASSWORD}}/$DATABASE_USERNAME/g" {} \;
find /flyway/sql/ -type f -name "*.sql" -exec sed -i "s/{{USER_NAME}}/$DATABASE_PASSWORD/g" {} \;

find /flyway/sql/ -type f -name "*.sql" -exec cat {} \;


/flyway/flyway "$@"

#!/bin/bash

# replace USER_PASSWORD env in sql scripts
find /flyway/sql/ -type f -name "*.sql" -exec sed -i "s/{{USER_PASSWORD}}/$USER_PASSWORD/g" {} \;

/flyway/flyway "$@"

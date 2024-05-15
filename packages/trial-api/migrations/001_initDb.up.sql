-- up.sql: Migrazione per creare la tabella 'Users'
CREATE TABLE category (
                id bigserial NOT NULL,
                code varchar NOT NULL,
                eservice varchar NOT NULL,
                description varchar NULL,
                "order" int8 NOT NULL,
                CONSTRAINT category_pk PRIMARY KEY (id)
            );
            CREATE INDEX category_eservice_idx ON category USING btree (eservice);
            
            CREATE TABLE "check" (
                id bigserial NOT NULL,
                code varchar NOT NULL,
                description varchar NULL,
                "order" int8 NOT NULL,
                category_id int8 NULL,
                CONSTRAINT check_pk PRIMARY KEY (id),
                CONSTRAINT check_category_fk FOREIGN KEY (category_id) REFERENCES category(id)
            );
            
            CREATE TABLE trial (
                id bigserial NOT NULL,
                purpose_id varchar NOT NULL,
                correlation_id varchar NOT NULL,
                operation_path varchar NOT NULL,
                check_id int8 NOT NULL,
                response bool DEFAULT false NULL,
                message varchar NULL,
                CONSTRAINT trial_pk PRIMARY KEY (id)
            );
            CREATE INDEX trial_correlation_id_idx ON trial USING btree (correlation_id);
            CREATE INDEX trial_operation_path_idx ON trial USING btree (operation_path);
            CREATE INDEX trial_purpose_id_idx ON trial USING btree (purpose_id);
            
            ALTER TABLE trial ADD CONSTRAINT trial_check_fk FOREIGN KEY (check_id) REFERENCES "check"(id);
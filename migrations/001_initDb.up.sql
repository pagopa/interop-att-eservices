-- Creazione dell'utente 'att' con password 'user_psw'
CREATE USER att WITH PASSWORD '{{USER_PASSWORD}}';

-- Creazione dello schema 'att'
CREATE SCHEMA IF NOT EXISTS att AUTHORIZATION att;

-- Concessione dei permessi all'utente 'att' sullo schema 'att'
GRANT USAGE ON SCHEMA att TO att;

-- Concessione dei permessi di INSERT, UPDATE e DELETE sulle tabelle dello schema 'att' all'utente 'att'
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA att TO att;

-- Impostazione dei permessi di default per le future tabelle dello schema 'att'
ALTER DEFAULT PRIVILEGES IN SCHEMA att
GRANT INSERT, UPDATE, DELETE ON TABLES TO att;

-- up.sql: Migrazione per creare la tabella 'Users'
CREATE TABLE category (
	id bigserial NOT NULL,
	code varchar NOT NULL,
	eservice varchar NULL,
	description varchar NULL,
	"order" int8 NOT NULL,
	CONSTRAINT category_pk PRIMARY KEY (id)
);

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
	operation_method varchar NOT NULL,
	check_id int8 NULL,
	response varchar DEFAULT 'KO'::character varying NOT NULL,
	message varchar NULL,
	created_date timestamp DEFAULT timezone('UTC'::text, now()) NOT NULL,
	CONSTRAINT trial_pk PRIMARY KEY (id),
	CONSTRAINT trial_check_fk FOREIGN KEY (check_id) REFERENCES public."check"(id)
);
CREATE INDEX trial_correlation_id_idx ON trial USING btree (correlation_id);
CREATE INDEX trial_operation_method_idx ON trial USING btree (operation_method);
CREATE INDEX trial_operation_path_idx ON trial USING btree (operation_path);
CREATE INDEX trial_purpose_id_idx ON trial USING btree (purpose_id);


INSERT INTO category (id,code,eservice,description,"order") VALUES
    (1,'VOUCHER','residence-verification,fiscalcode-verification,piva-verification,digital-address-verification-verify,digital-address-verification-extract','bearer token',1),
    (2,'Agid-JWT-Signature','residence-verification','token in Headers',2),
    (3,'Agid-JWT-TrackingEvidence','residence-verification','token in Headers',3),
    (4,'cert','fiscalcode-verification,piva-verification','Verify certificate validity',2),
    (5,'e-service','residence-verification-001','e-service exposed by the application',4),
    (6,'e-service','fiscalcode-verification','e-service exposed by the application',3),
    (7,'e-service','piva-verification','e-service exposed by the application',3),
    (8,'e-service','digital-address-verification-verify','e-service exposed by the application',2),
    (9,'e-service','digital-address-verification-extract','e-service exposed by the application',2),
    (10,'e-service','digital-address-verification-list','e-service exposed by the application',2),
    (11,'e-service','digital-address-verification-list-state','e-service exposed by the application',2),
    (12,'e-service','digital-address-verification-list-response','e-service exposed by the application',2),
    (13,'e-service','residence-verification-002','e-service exposed by the application',4);

INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (1,'authData','Bearer token can not be parsed',1,1),
    (2,'header','not present',2,1),
    (3,'payload','not present',3,1),
    (4,'typ','"typ" not valid in Authentication Bearer',4,1),
    (5,'iss','"iss" not valid in Authentication Bearer header',5,1),
    (6,'aud','"aud" not valid in Authentication Bearer header',6,1),
    (7,'agid-jwt-signature','header attribute not present',1,2),
    (8,'agid-jwt-signature','header attribute not valid',2,2),
    (9,'publicKeyService','token not valid',3,2),
    (10,'payload','not present',4,2);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (11,'exp','"exp" is required in agid-jwt-signature payload token',5,2),
    (12,'exp','"exp" is expired in agid-jwt-signature payload token',6,2),
    (13,'iat','"iat" is required in agid-jwt-signature payload token',7,2),
    (14,'iat','"iat" is expired in agid-jwt-signature payload token',8,2),
    (15,'aud','"aud" is required in agid-jwt-signature payload token',9,2),
    (16,'aud','"aud" is not valid in agid-jwt-signature payload token',10,2),
    (17,'content-type','"content-type" is required in agid-jwt-signature payload token',11,2),
    (18,'content-encoding','"content-encoding" is required in agid-jwt-signature payload token',12,2),
    (19,'signed-headers','"signed-headers" is required in agid-jwt-signature payload token',13,2),
    (20,'signed-headers_content-type','"content-type" in "signed-headers" is required in agid-jwt-signature payload token',14,2);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (21,'signed-headers_content-encoding','"content-encoding" in "signed-headers" is required in agid-jwt-signature payload token',15,2),
    (22,'signed-headers_digest','"digest" in "signed-headers" is required in agid-jwt-signature payload token',16,2),
    (23,'signed-headers_content-type','"content-type" in "signed-headers" not match with "content-type" in headers',17,2),
    (24,'signed-headers_content-encoding','"content-encoding" in "signed-headers" not match with "content-encoding" in headers',18,2),
    (25,'signed-headers_digest','"digest" in "signed-headers" not start with "SHA-256="',19,2),
    (26,'digest','"digest" in headers not start with "SHA-256="',20,2),
    (27,'signed-headers_digest','"digest" in "signed-headers" not match with "digest" in headers',21,2),
    (28,'digest','hashed request body not match with the "digest" in the "signed-headers"',22,2),
    (29,'agid-jwt-trackingevidence','header attribute not present',1,3),
    (30,'agid-jwt-trackingevidence','header attribute not valid',2,3);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (31,'publicKeyService','token not valid',3,3),
    (32,'payload','not present',4,3),
    (33,'exp','"exp "is required in agid-jwt-trackingevidence payload token',5,3),
    (34,'exp','"exp" is expired in agid-jwt-trackingevidence payload token',6,3),
    (35,'iat','"iat" is required in agid-jwt-trackingevidence payload token',7,3),
    (36,'iat','"iat" is expired in agid-jwt-trackingevidence payload token',8,3),
    (37,'aud','"aud" is required in agid-jwt-trackingevidence payload token',9,3),
    (38,'aud','"aud" is not valid in agid-jwt-trackingevidence payload token',10,3),
    (39,'iss','"iss" is required in agid-jwt-trackingevidence payload token',11,3),
    (40,'purposeId','"purposeId" not valid in agid-jwt-trackingevidence payload token',12,3);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (41,'userID','"userID" not valid in agid-jwt-trackingevidence payload token',13,3),
    (42,'userLocation','"userLocation" not valid in agid-jwt-trackingevidence payload token',14,3),
    (43,'LoA','"LoA" not valid in agid-jwt-trackingevidence payload token',15,3),
    (44,'VOUCHER','Authorization bearer token',7,1),
    (45,'Agid-JWT-Signature','Token in the request Headers',23,2),
    (46,'Agid-JWT-TrackingEvidence','Token in the request Headers',18,3),
    (47,'residence-verification-001','API for a consultation of a residence',4,5),
    (48,'fiscalcode-verification','API to validate a specific fiscal code',3,6),
    (49,'cert','OK',2,4),
    (50,'cert','Not Valid',2,4);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES   
    (51,'piva-verification','API to validate a specific vat code',3,7),
    (52,'digital-address-verification-verify','API to validate a specific digital address associated with a fiscal code',2,8),
    (53,'digital-address-verification-extract','API to validate a specific digital address associated with a fiscal code',2,9),
    (54,'digital-address-verification-list','API thath allows you to enter a request for the extraction of digital address',2,10),
    (55,'digital-address-verification-list-state','API that allows you to check the processing status of the request for the list of digital address',2,11),
    (56,'digital-address-verification-list-response','API that allows you to retrieve the list of digital address',2,12),
    (57,'residence-verification-002','API to verify a residence',4,13);
INSERT INTO category (id,code,eservice,description,"order") VALUES
    (1,'authData','Bearer token validation','Bearer token can not be parsed',1),
    (2,'header','Bearer token validation','not present',2),
    (3,'payload','Bearer token validation','not present',3),
    (4,'typ','Bearer token validation','"typ" not valid in Authentication Bearer',4),
    (5,'iss','Bearer token validation','"iss" not valid in Authentication Bearer header',5),
    (6,'aud','Bearer token validation','"aud" not valid in Authentication Bearer header',6),
    (7,'agid-jwt-signature','Signature token validation','header attribute not present',1),
    (8,'agid-jwt-signature','Signature token validation','header attribute not valid',2),
    (9,'publicKeyService','Signature token validation','token not valid',3),
    (10,'payload','Signature token validation','not present',4);
INSERT INTO category (id,code,eservice,description,"order") VALUES
    (11,'exp','Signature token validation','"exp" is required in agid-jwt-signature payload token',5),
    (12,'exp','Signature token validation','"exp" is expired in agid-jwt-signature payload token',6),
    (13,'iat','Signature token validation','"iat" is required in agid-jwt-signature payload token',7),
    (14,'iat','Signature token validation','"iat" is expired in agid-jwt-signature payload token',8),
    (15,'aud','Signature token validation','"aud" is required in agid-jwt-signature payload token',9),
    (16,'aud','Signature token validation','"aud" is not valid in agid-jwt-signature payload token',10),
    (17,'content-type','Signature token validation','"content-type" is required in agid-jwt-signature payload token',11),
    (18,'content-encoding','Signature token validation','"content-encoding" is required in agid-jwt-signature payload token',12),
    (19,'signed-headers','Signature token validation','"signed-headers" is required in agid-jwt-signature payload token',13),
    (20,'signed-headers_content-type','Signature token validation','"content-type" in "signed-headers" is required in agid-jwt-signature payload token',14);
INSERT INTO category (id,code,eservice,description,"order") VALUES
    (21,'signed-headers_content-encoding','Signature token validation','"content-encoding" in "signed-headers" is required in agid-jwt-signature payload token',15),
    (22,'signed-headers_digest','Signature token validation','"digest" in "signed-headers" is required in agid-jwt-signature payload token',16),
    (23,'signed-headers_content-type','Signature token validation','"content-type" in "signed-headers" not match with "content-type" in headers',17),
    (24,'signed-headers_content-encoding','Signature token validation','"content-encoding" in "signed-headers" not match with "content-encoding" in headers',18),
    (25,'signed-headers_digest','Signature token validation','"digest" in "signed-headers" not start with "SHA-256="',19),
    (26,'digest','Signature token validation','"digest" in headers not start with "SHA-256="',20),
    (27,'signed-headers_digest','Signature token validation','"digest" in "signed-headers" not match with "digest" in headers',21),
    (28,'digest','Signature token validation','hashed request body not match with the "digest" in the "signed-headers"',22),
    (29,'agid-jwt-trackingevidence','TrackingEvidence token validation','header attribute not present',1),
    (30,'agid-jwt-trackingevidence','TrackingEvidence token validation','header attribute not valid',2);
INSERT INTO category (id,code,eservice,description,"order") VALUES
    (31,'publicKeyService','TrackingEvidence token validation','token not valid',3),
    (32,'payload','TrackingEvidence token validation','not present',4),
    (33,'exp','TrackingEvidence token validation','"exp "is required in agid-jwt-trackingevidence payload token',5),
    (34,'exp','TrackingEvidence token validation','"exp" is expired in agid-jwt-trackingevidence payload token',6),
    (35,'iat','TrackingEvidence token validation','"iat" is required in agid-jwt-trackingevidence payload token',7),
    (36,'iat','TrackingEvidence token validation','"iat" is expired in agid-jwt-trackingevidence payload token',8),
    (37,'aud','TrackingEvidence token validation','"aud" is required in agid-jwt-trackingevidence payload token',9),
    (38,'aud','TrackingEvidence token validation','"aud" is not valid in agid-jwt-trackingevidence payload token',10),
    (39,'iss','TrackingEvidence token validation','"iss" is required in agid-jwt-trackingevidence payload token',11),
    (40,'purposeId','TrackingEvidence token validation','"purposeId" not valid in agid-jwt-trackingevidence payload token',12);
INSERT INTO category (id,code,eservice,description,"order") VALUES
    (41,'userID','TrackingEvidence token validation','"userID" not valid in agid-jwt-trackingevidence payload token',13),
    (42,'userLocation','TrackingEvidence token validation','"userLocation" not valid in agid-jwt-trackingevidence payload token',14),
    (43,'LoA','TrackingEvidence token validation','"LoA" not valid in agid-jwt-trackingevidence payload token',15);

INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (1,'VOUCHER','bearer token',1,1),
    (2,'VOUCHER','bearer token',1,2),
    (3,'VOUCHER','bearer token',1,3),
    (4,'VOUCHER','bearer token',1,4),
    (5,'VOUCHER','bearer token',1,5),
    (6,'VOUCHER','bearer token',1,6),
    (7,'Agid-JWT-Signature','token in Headers',2,7),
    (8,'Agid-JWT-Signature','token in Headers',2,8),
    (9,'Agid-JWT-Signature','token in Headers',2,9),
    (10,'Agid-JWT-Signature','token in Headers',2,10);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (11,'Agid-JWT-Signature','token in Headers',2,11),
    (12,'Agid-JWT-Signature','token in Headers',2,12),
    (13,'Agid-JWT-Signature','token in Headers',2,13),
    (14,'Agid-JWT-Signature','token in Headers',2,14),
    (15,'Agid-JWT-Signature','token in Headers',2,15),
    (16,'Agid-JWT-Signature','token in Headers',2,16),
    (17,'Agid-JWT-Signature','token in Headers',2,17),
    (18,'Agid-JWT-Signature','token in Headers',2,18),
    (19,'Agid-JWT-Signature','token in Headers',2,19),
    (20,'Agid-JWT-Signature','token in Headers',2,20);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (21,'Agid-JWT-Signature','token in Headers',2,21),
    (22,'Agid-JWT-Signature','token in Headers',2,22),
    (23,'Agid-JWT-Signature','token in Headers',2,23),
    (24,'Agid-JWT-Signature','token in Headers',2,24),
    (25,'Agid-JWT-Signature','token in Headers',2,25),
    (26,'Agid-JWT-Signature','token in Headers',2,26),
    (27,'Agid-JWT-Signature','token in Headers',2,27),
    (28,'Agid-JWT-Signature','token in Headers',2,28),
    (29,'Agid-JWT-TrackingEvidence','token in Headers',3,29),
    (30,'Agid-JWT-TrackingEvidence','token in Headers',3,30);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (31,'Agid-JWT-TrackingEvidence','token in Headers',3,31),
    (32,'Agid-JWT-TrackingEvidence','token in Headers',3,32),
    (33,'Agid-JWT-TrackingEvidence','token in Headers',3,33),
    (34,'Agid-JWT-TrackingEvidence','token in Headers',3,34),
    (35,'Agid-JWT-TrackingEvidence','token in Headers',3,35),
    (36,'Agid-JWT-TrackingEvidence','token in Headers',3,36),
    (37,'Agid-JWT-TrackingEvidence','token in Headers',3,37),
    (38,'Agid-JWT-TrackingEvidence','token in Headers',3,38),
    (39,'Agid-JWT-TrackingEvidence','token in Headers',3,39),
    (40,'Agid-JWT-TrackingEvidence','token in Headers',3,40);
INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (41,'Agid-JWT-TrackingEvidence','token in Headers',3,41),
    (42,'Agid-JWT-TrackingEvidence','token in Headers',3,42),
    (43,'Agid-JWT-TrackingEvidence','token in Headers',3,43),
    (44,'VOUCHER','OK',1,NULL),
    (45,'Agid-JWT-Signature','OK',2,NULL),
    (46,'Agid-JWT-TrackingEvidence','OK',3,NULL);

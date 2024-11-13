INSERT INTO category (id,code,eservice,description,"order") VALUES
    (14,'e-service','family-status','e-service exposed by the application', 2),
    (15,'e-service','keychain-mock','e-service exposed by the application', 2);

INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (58,'family-status','API for a consultation of a family status',2,14),
    (59,'keychain-mock','API for a consultation of a signature status',2,15);




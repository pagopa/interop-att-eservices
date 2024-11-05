INSERT INTO category (id,code,eservice,description,"order") VALUES
    (14,'e-service','family-status','e-service exposed by the application',4);

INSERT INTO "check" (id,code,description,"order",category_id) VALUES
    (58,'family-status','API for a consultation of a residence',4,14);




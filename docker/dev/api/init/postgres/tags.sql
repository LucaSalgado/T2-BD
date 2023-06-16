\connect bocadb;

DROP TABLE IF EXISTS "tagstable" CASCADE;
CREATE TABLE "public"."tagstable" (
    "problemnumber" integer NOT NULL,
    "tagid" integer NOT NULL,
    "tagname" character varying(50) NOT NULL,
    "tagvalue" character varying(50) NOT NULL,
    CONSTRAINT "problemtags_pkey" PRIMARY KEY ("problemnumber", "tagid")
) WITH (oids = false);

INSERT INTO "tagstable" ("problemnumber", "tagid", "tagname", "tagvalue") VALUES
(2004, 1,	'level',    'easy'),
(2006, 1,	'lang',     'relax'),
(2004, 2,   'lang',     'mysql');
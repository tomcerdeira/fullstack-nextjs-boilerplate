-- Table: public.migrations

-- DROP TABLE IF EXISTS public.migrations;

CREATE TABLE IF NOT EXISTS public.migrations
(
    file_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    hash character varying(255) COLLATE pg_catalog."default",
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT migrations_pkey PRIMARY KEY (file_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.migrations
    OWNER to postgres;
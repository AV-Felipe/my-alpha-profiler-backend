CREATE DATABASE my_alpha_profiler_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE TABLE IF NOT EXISTS users (
	id serial,
	username VARCHAR (50) NOT NULL,
	password VARCHAR (60) NOT NULL,
	email VARCHAR (255) NOT NULL,
	birthdate DATE NOT NULL,
	user_image VARCHAR (255),
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE,
	deleted_at BIGINT DEFAULT 0,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY (email, active, deleted_at)
);
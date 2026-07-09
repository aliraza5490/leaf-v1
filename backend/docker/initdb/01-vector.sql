SELECT 'CREATE DATABASE leaf' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'leaf')\gexec
\c leaf
CREATE EXTENSION IF NOT EXISTS vector;


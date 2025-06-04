
DROP TABLE IF EXISTS tree_generator_inputs CASCADE;
DROP TABLE IF EXISTS graph_generator_inputs CASCADE;
DROP TABLE IF EXISTS matrix_generator_inputs CASCADE;
DROP TABLE IF EXISTS vector_generator_inputs CASCADE;
DROP TABLE IF EXISTS string_generator_inputs CASCADE;
DROP TABLE IF EXISTS number_generator_inputs CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE number_generator_inputs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    min_value INTEGER,
    max_value INTEGER,
    count INTEGER,
    parity VARCHAR(10),
    sign VARCHAR(10),
    sorted VARCHAR(50),
    data_type VARCHAR(20),
    unique_numbers BOOLEAN,
    pattern VARCHAR(50),
    step INTEGER,
    include_zero BOOLEAN,
    include_min BOOLEAN,
    include_max BOOLEAN,
    edge_empty_input BOOLEAN,
    edge_single_element BOOLEAN,
    edge_all_equal BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE string_generator_inputs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    string_min INT,
    string_max INT,
    same_length INT,
    include_prefix VARCHAR(255),
    include_suffix VARCHAR(255),
    sorting VARCHAR(20),
    string_unique BOOLEAN,
    string_letter VARCHAR(255),
    string_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE vector_generator_inputs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    vector_length INT,
    vector_min NUMERIC,
    vector_max NUMERIC,
    vector_parity VARCHAR(10),
    vector_sign VARCHAR(5),
    vector_type VARCHAR(10),
    vector_unique BOOLEAN,
    vector_palindrome BOOLEAN,
    vector_line INT,
    vector_sorted VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE matrix_generator_inputs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    matrix_rows INTEGER NOT NULL,
    matrix_cols INTEGER NOT NULL,
    matrix_map BOOLEAN NOT NULL,
    matrix_min INTEGER NOT NULL,
    matrix_max INTEGER NOT NULL,
    matrix_parity VARCHAR(10),
    matrix_unique BOOLEAN NOT NULL,
    matrix_sign VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE graph_generator_inputs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    graph_nodes INTEGER NOT NULL,
    graph_edges INTEGER NOT NULL,
    graph_oriented BOOLEAN NOT NULL,
    graph_connected BOOLEAN NOT NULL,
    graph_bipartit BOOLEAN NOT NULL,
    graph_weighted BOOLEAN NOT NULL,
    graph_min_weight INTEGER,
    graph_max_weight INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE tree_generator_inputs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tree_nodes INTEGER NOT NULL,
    tree_binary BOOLEAN NOT NULL,
    tree_lvl INTEGER NOT NULL,
    tree_weighted BOOLEAN NOT NULL,
    tree_min_weight INTEGER,
    tree_max_weight INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE OR REPLACE FUNCTION pre_insert() RETURNS TRIGGER AS $$
DECLARE
    cnt INTEGER;
BEGIN
    SELECT COUNT(*) INTO cnt FROM users WHERE email = NEW.email;
    IF cnt > 0 THEN
       RAISE EXCEPTION 'User email % already exists', NEW.email;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION pre_delete() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.role <> 'user' THEN
       RAISE EXCEPTION 'Cannot delete admin user';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER insert_user
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE PROCEDURE pre_insert();

CREATE TRIGGER delete_user
  BEFORE DELETE ON users
  FOR EACH ROW EXECUTE PROCEDURE pre_delete();


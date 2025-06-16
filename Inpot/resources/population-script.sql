
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

CREATE OR REPLACE VIEW user_input_statistics_view AS
SELECT
    u.id AS user_id,
    (
        COUNT(DISTINCT n.id) +
        COUNT(DISTINCT s.id) +
        COUNT(DISTINCT v.id) +
        COUNT(DISTINCT m.id)
        ) AS total_generations,

    COUNT(DISTINCT n.id) AS number_count,
    COUNT(DISTINCT s.id) AS string_count,
    COUNT(DISTINCT v.id) AS vector_count,
    COUNT(DISTINCT m.id) AS matrix_count,

    (
        SELECT MIN(created_at)
        FROM (
                 SELECT created_at FROM number_generator_inputs WHERE user_id = u.id
                 UNION ALL
                 SELECT created_at FROM string_generator_inputs WHERE user_id = u.id
                 UNION ALL
                 SELECT created_at FROM vector_generator_inputs WHERE user_id = u.id
                 UNION ALL
                 SELECT created_at FROM matrix_generator_inputs WHERE user_id = u.id
             ) AS all_dates
    ) AS first_generation,

    (
        SELECT MAX(created_at)
        FROM (
                 SELECT created_at FROM number_generator_inputs WHERE user_id = u.id
                 UNION ALL
                 SELECT created_at FROM string_generator_inputs WHERE user_id = u.id
                 UNION ALL
                 SELECT created_at FROM vector_generator_inputs WHERE user_id = u.id
                 UNION ALL
                 SELECT created_at FROM matrix_generator_inputs WHERE user_id = u.id
             ) AS all_dates
    ) AS last_generation,

    AVG(n.count)::NUMERIC(10,2) AS avg_number_count,
    MIN(n.count) AS min_number_count,
    MAX(n.count) AS max_number_count,

    AVG(s.string_count)::NUMERIC(10,2) AS avg_string_count,
    MIN(s.string_count) AS min_string_count,
    MAX(s.string_count) AS max_string_count,

    AVG(v.vector_length)::NUMERIC(10,2) AS avg_vector_length,
    MIN(v.vector_length) AS min_vector_length,
    MAX(v.vector_length) AS max_vector_length,

    AVG(m.matrix_rows)::NUMERIC(10,2) AS avg_matrix_rows,
    MIN(m.matrix_rows) AS min_matrix_rows,
    MAX(m.matrix_rows) AS max_matrix_rows,

    AVG(m.matrix_cols)::NUMERIC(10,2) AS avg_matrix_cols,
    MIN(m.matrix_cols) AS min_matrix_cols,
    MAX(m.matrix_cols) AS max_matrix_cols,

    COUNT(DISTINCT n.min_value || '-' || n.max_value || '-' || n.count || '-' || COALESCE(n.parity, '') || '-' || COALESCE(n.sign, '')) AS unique_number_combinations,
    COUNT(DISTINCT CASE WHEN n.unique_numbers THEN n.id END) AS number_unique_true,
    COUNT(DISTINCT CASE WHEN n.edge_empty_input THEN n.id END) AS number_edge_empty_true,
    COUNT(DISTINCT CASE WHEN n.edge_single_element THEN n.id END) AS number_edge_single_true,
    COUNT(DISTINCT CASE WHEN n.edge_all_equal THEN n.id END) AS number_edge_all_equal_true,

    COUNT(DISTINCT s.string_min || '-' || s.string_max || '-' || s.string_count || '-' || COALESCE(s.sorting, '') || '-' || COALESCE(s.string_letter, '')) AS unique_string_combinations,
    COUNT(DISTINCT CASE WHEN s.string_unique THEN s.id END) AS string_unique_true,
    COUNT(DISTINCT CASE WHEN s.include_prefix IS NOT NULL AND s.include_prefix <> '' THEN s.id END) AS used_prefix,
    COUNT(DISTINCT CASE WHEN s.include_suffix IS NOT NULL AND s.include_suffix <> '' THEN s.id END) AS used_suffix,

    COUNT(DISTINCT v.vector_length || '-' || v.vector_min || '-' || v.vector_max || '-' || COALESCE(v.vector_type, '') || '-' || COALESCE(v.vector_sorted, '')) AS unique_vector_combinations,
    COUNT(DISTINCT CASE WHEN v.vector_unique THEN v.id END) AS vector_unique_true,
    COUNT(DISTINCT CASE WHEN v.vector_palindrome THEN v.id END) AS vector_palindrome_true,
    COUNT(DISTINCT CASE WHEN v.vector_sorted IS NOT NULL AND v.vector_sorted <> '' THEN v.id END) AS vector_sorted_used,

    COUNT(DISTINCT m.matrix_rows || 'x' || m.matrix_cols || '-' || m.matrix_min || '-' || m.matrix_max || '-' || COALESCE(m.matrix_parity, '') || '-' || m.matrix_sign) AS unique_matrix_combinations,
    COUNT(DISTINCT CASE WHEN m.matrix_map THEN m.id END) AS matrix_map_true,
    COUNT(DISTINCT CASE WHEN m.matrix_unique THEN m.id END) AS matrix_unique_true


FROM users u
         LEFT JOIN number_generator_inputs n ON n.user_id = u.id
         LEFT JOIN string_generator_inputs s ON s.user_id = u.id
         LEFT JOIN vector_generator_inputs v ON v.user_id = u.id
         LEFT JOIN matrix_generator_inputs m ON m.user_id = u.id
GROUP BY u.id;

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

CREATE OR REPLACE FUNCTION count_total_user_generations(p_user_id INTEGER)
    RETURNS INTEGER
AS $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT
        (SELECT COUNT(*) FROM number_generator_inputs WHERE user_id = p_user_id) +
        (SELECT COUNT(*) FROM string_generator_inputs WHERE user_id = p_user_id) +
        (SELECT COUNT(*) FROM vector_generator_inputs WHERE user_id = p_user_id) +
        (SELECT COUNT(*) FROM matrix_generator_inputs WHERE user_id = p_user_id) +
        (SELECT COUNT(*) FROM graph_generator_inputs WHERE user_id = p_user_id) +
        (SELECT COUNT(*) FROM tree_generator_inputs WHERE user_id = p_user_id)
    INTO total_count;

    RETURN total_count;
END;
$$ LANGUAGE plpgsql;


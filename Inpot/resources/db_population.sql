DO $$
    DECLARE
        lastNames text[] := ARRAY['Doe','Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez'];
        maleFirstNames text[] := ARRAY['John','Peter','Robert','Michael','David','James','William','Richard','Joseph','Charles'];
        femaleFirstNames text[] := ARRAY['Mary','Linda','Patricia','Jennifer','Elizabeth','Barbara','Susan','Jessica','Sarah','Karen'];

        v_first_name text;
        v_last_name text;
        v_email text;
        v_user_id integer;
        i integer;
        arr_len integer;
    BEGIN
        RAISE NOTICE 'Inserting sample users with generator inputs...';
        FOR i IN 1..10 LOOP
                IF mod(i, 2) = 0 THEN
                    arr_len := array_length(femaleFirstNames, 1);
                    v_first_name := femaleFirstNames[(floor(random() * arr_len)::integer + 1)];
                ELSE
                    arr_len := array_length(maleFirstNames, 1);
                    v_first_name := maleFirstNames[(floor(random() * arr_len)::integer + 1)];
                END IF;
                arr_len := array_length(lastNames, 1);
                v_last_name := lastNames[(floor(random() * arr_len)::integer + 1)];
                v_email := lower(v_first_name || '.' || v_last_name || '@example.com');

                INSERT INTO users (first_name, last_name, email, password, role, created_at)
                VALUES (v_first_name, v_last_name, v_email, 'password', 'user', now())
                RETURNING id INTO v_user_id;

                INSERT INTO number_generator_inputs (
                    user_id, min_value, max_value, count, parity, sign, sorted, data_type, unique_numbers,
                    pattern, step, include_zero, include_min, include_max, edge_empty_input, edge_single_element,
                    edge_all_equal, created_at)
                VALUES (
                           v_user_id, 1, 100, 10, 'even', 'positive', 'yes', 'integer', true,
                           'linear', 1, false, true, true, false, false, false, now());

                INSERT INTO string_generator_inputs (
                    user_id, string_min, string_max, same_length, include_prefix, include_suffix, sorting,
                    string_unique, string_letter, string_count, created_at)
                VALUES (
                           v_user_id, 5, 15, 10, 'pre-', '-suf', 'asc', true, 'a,b', 5, now());

                INSERT INTO vector_generator_inputs (
                    user_id, vector_length, vector_min, vector_max, vector_parity, vector_sign, vector_type,
                    vector_unique, vector_palindrome, vector_line, vector_sorted, created_at)
                VALUES (
                           v_user_id, 5, 0, 10, 'odd', '-', 'integer', false, false, 1, 'yes', now());

                INSERT INTO matrix_generator_inputs (
                    user_id, matrix_rows, matrix_cols, matrix_map, matrix_min, matrix_max, matrix_parity,
                    matrix_unique, matrix_sign, created_at)
                VALUES (
                           v_user_id, 3, 3, true, 1, 9, 'even', true, '+', now());

                INSERT INTO graph_generator_inputs (
                    user_id, graph_nodes, graph_edges, graph_oriented, graph_connected, graph_bipartit,
                    graph_weighted, graph_min_weight, graph_max_weight, created_at)
                VALUES (
                           v_user_id, 5, 7, true, true, false, true, 1, 3, now());

                INSERT INTO tree_generator_inputs (
                    user_id, tree_nodes, tree_binary, tree_lvl, tree_weighted, tree_min_weight,tree_max_weight, created_at)
                VALUES (
                           v_user_id, 7, true, 3, false, 1,3, now());
            END LOOP;

        RAISE NOTICE 'Sample data insertion completed.';
    END $$;
-- Matrix A (2x3)
CREATE TABLE MatrixA (
    row_id INT,
    col_id INT,
    value DECIMAL(10,2)
);

INSERT INTO MatrixA (row_id, col_id, value) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3),
(2, 1, 4), (2, 2, 5), (2, 3, 6);

-- Matrix B (3x2)
CREATE TABLE MatrixB (
    row_id INT,
    col_id INT,
    value DECIMAL(10,2)
);

INSERT INTO MatrixB (row_id, col_id, value) VALUES
(1, 1, 7), (1, 2, 8),
(2, 1, 9), (2, 2, 10),
(3, 1, 11), (3, 2, 12);


SELECT
    A.row_id AS row_in_A,
    B.col_id AS col_in_B,
    SUM(A.value * B.value) AS result_value
FROM MatrixA A
JOIN MatrixB B
    ON A.col_id = B.row_id
GROUP BY
    A.row_id,
    B.col_id
ORDER BY
    A.row_id,
    B.col_id;

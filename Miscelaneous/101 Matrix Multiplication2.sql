-- Matrix A (2x2)
CREATE TABLE MatrixA (
    a11 INT, a12 INT,
    a21 INT, a22 INT
);

INSERT INTO MatrixA VALUES (1, 2, 3, 4);

-- Matrix B (2x2)
CREATE TABLE MatrixB (
    b11 INT, b12 INT,
    b21 INT, b22 INT
);

INSERT INTO MatrixB VALUES (5, 6, 7, 8);

SELECT
    (a.a11 * b.b11 + a.a12 * b.b21) AS c11,
    (a.a11 * b.b12 + a.a12 * b.b22) AS c12,
    (a.a21 * b.b11 + a.a22 * b.b21) AS c21,
    (a.a21 * b.b12 + a.a22 * b.b22) AS c22
FROM MatrixA a
CROSS JOIN MatrixB b;

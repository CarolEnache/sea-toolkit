-- Recover the previous data
CREATE TABLE TempTable AS SELECT * FROM PARQUET_TABLE;
-- Insert the new data
INSERT INTO TempTable INSERT_CLAUSE;
-- Save changes
COPY TempTable TO PARQUET_TABLE;
-- Drop the temporary tables
DROP TABLE TempTable;

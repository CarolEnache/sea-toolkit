-- Recover the previous data
CREATE TABLE IF NOT EXISTS TempTable AS SELECT * FROM PARQUET_TABLE;
-- Delete the data
DELETE FROM TempTable WHERE_CLAUSE;
-- Save changes
COPY TempTable TO PARQUET_TABLE;
-- Drop the temporary tables
DROP TABLE TempTable;

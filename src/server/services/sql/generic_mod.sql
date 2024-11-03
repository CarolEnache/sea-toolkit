-- Recover the previous data
CREATE TABLE TempTable AS SELECT * FROM PARQUET_TABLE;
-- Modify the data
UPDATE TempTable UPDATE_CLAUSE WHERE_CLAUSE;
-- Save changes
COPY TempTable TO PARQUET_TABLE;
-- Drop the temporary tables
DROP TABLE TempTable;

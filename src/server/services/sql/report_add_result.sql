-- Setup the table
CREATE TABLE IF NOT EXISTS TempTable (
  forecast_group VARCHAR(255),
  economic_factor VARCHAR(255),
  manufacturing_stage VARCHAR(255),
  period VARCHAR(255),
  economic_parameter VARCHAR(255),
  region VARCHAR(255),
  value INT
);
-- Recover the previous data
INSERT INTO TempTable SELECT
  forecast_group,
  economic_factor,
  manufacturing_stage,
  period,
  economic_parameter,
  region,
  value,
FROM PARQUET_TABLE
WHERE NOT EXISTS (SELECT 1 FROM TempTable LIMIT 1);
-- Insert the new data
INSERT INTO TempTable INSERT_CLAUSE;
-- Save changes
COPY TempTable TO PARQUET_TABLE;
-- Drop the temporary tables
DROP TABLE TempTable;

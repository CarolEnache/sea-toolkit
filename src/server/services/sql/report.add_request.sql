-- Setup the table
CREATE TABLE IF NOT EXISTS TempTable (
  region VARCHAR(255) DEFAULT 'Global',
  product VARCHAR(255) DEFAULT 'All products',
  mode VARCHAR(255) DEFAULT 'ISIC sectorial analysis',
  value_endUse BOOLEAN DEFAULT TRUE,
  value_firstUse BOOLEAN DEFAULT TRUE,
  value_mining BOOLEAN DEFAULT TRUE,
  value_recycling BOOLEAN DEFAULT TRUE,
  value_refining BOOLEAN DEFAULT TRUE,
  contribution_input BOOLEAN DEFAULT TRUE,
  contribution_valueAdded BOOLEAN DEFAULT TRUE,
  effect_directEffect BOOLEAN DEFAULT TRUE,
  effect_firstRound BOOLEAN DEFAULT TRUE,
  effect_incomeEffect BOOLEAN DEFAULT TRUE,
  effect_industrialSupport BOOLEAN DEFAULT TRUE,
  report_id VARCHAR(255) NOT NULL PRIMARY KEY,
  report_license VARCHAR(255) NOT NULL,
  report_status VARCHAR(50) DEFAULT 'pending'
);
-- Recover the previous data
INSERT INTO TempTable SELECT
  COALESCE(region, 'Global'),
  COALESCE(product, 'All products'),
  COALESCE(mode, 'ISIC sectorial analysis'),
  COALESCE(value_endUse, TRUE),
  COALESCE(value_firstUse, TRUE),
  COALESCE(value_mining, TRUE),
  COALESCE(value_recycling, TRUE),
  COALESCE(value_refining, TRUE),
  COALESCE(contribution_input, TRUE),
  COALESCE(contribution_valueAdded, TRUE),
  COALESCE(effect_directEffect, TRUE),
  COALESCE(effect_firstRound, TRUE),
  COALESCE(effect_incomeEffect, TRUE),
  COALESCE(effect_industrialSupport, TRUE),
  report_id,
  report_license,
  COALESCE(report_status, 'pending')
FROM PARQUET_TABLE
WHERE NOT EXISTS (SELECT 1 FROM TempTable LIMIT 1);
-- Insert the new data
INSERT INTO TempTable INSERT_CLAUSE;
-- Save changes
COPY TempTable TO PARQUET_TABLE;
-- Drop the temporary tables
DROP TABLE TempTable;

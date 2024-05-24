SELECT
  "Table Description", "Region", "Year", "ISIC"
  SUM(CASE WHEN "Value" = '...' THEN 0 ELSE CAST("Value" AS BIGINT) END) AS "Value"
FROM PARQUET_TABLE
GROUP BY
  "Table Description", "Region", "Year", "ISIC"
import os
import sys
import duckdb

# Check if there are enough arguments
if len(sys.argv) <= 1:
  sys.exit(1)

# Get arguments
query_str = sys.argv[1]

# Print the JSON data to the output
print(
  # Use DuckDB to execute the query
duckdb.query(query_str)
    # Fetch the DataFrame
    .fetchdf()
    # Convert the DataFrame to a JSON string
    .to_json(orient='records')
)

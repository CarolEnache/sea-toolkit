import os
import sys
import duckdb

# Check if there are enough arguments
if len(sys.argv) <= 1:
  sys.exit(1)

# Get arguments
filename = sys.argv[1]
start_row = int(sys.argv[2]) if len(sys.argv) > 2 else 0
page_size = int(sys.argv[3]) if len(sys.argv) > 3 else 0

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the Parquet file
parquet_file = os.path.join(script_dir, filename)

# Load all query
load_all_query = f"SELECT * FROM read_parquet('{parquet_file}')"
# Load paginated
load_paginated_query = f"SELECT * FROM read_parquet('{parquet_file}', {start_row}, {page_size})"

# Pivot (example)
# pivot_query = f"""
# SELECT *
# FROM read_parquet('{parquet_file}')
# PIVOT (
#   SUM(value)
#   FOR region IN ('Europe', 'Asia')
# )
# """

# Select unique (example)
# unique_query = f"""
# SELECT DISTINCT region
# FROM read_parquet('{parquet_file}')
# """

# Read the Parquet file directly
if page_size == 0:
  df = duckdb.query(load_all_query).fetch_df()
else:
  df = duckdb.query(load_paginated_query).fetch_df()

# Convert the DataFrame to a JSON string
json_data = df.to_json(orient='records')

# Print the JSON data to the output
print(json_data)

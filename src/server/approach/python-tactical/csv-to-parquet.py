import os
import pandas as pd

def split_excel_to_parquet(input_file, filename):
  df = pd.read_csv(input_file)
  
  # Save the DataFrame to a Parquet file with gzip compression
  output_file = f"./parquet/{filename}.parquet"
  df.to_parquet(output_file, index=False)
      
  print(f"Saved {input_file} to {output_file}")

if __name__ == "__main__":
  # Set the directory path
  directory_path = './csv'

  # Loop through each file in the directory
  for filename in os.listdir(directory_path):
    file_path = os.path.join(directory_path, filename)
    # Check if the item is a file
    if os.path.isfile(file_path):
      # Process the file
      print(f"Processing file: {file_path}")
      # Add your file processing code here
      split_excel_to_parquet(file_path, os.path.splitext(filename)[0])

import pandas as pd
from openpyxl import Workbook

def split_excel_sheets(input_file):
  # Read the entire Excel file
  xls = pd.ExcelFile(input_file)
  print(f"Processing {input_file}")
    
  # Iterate over each sheet and save it as a separate Excel file
  for sheet_name in xls.sheet_names:
    df = pd.read_excel(input_file, sheet_name=sheet_name)
    print(f"Processing sheet {sheet_name}")
    
    # Save the sheet to a new Excel file
    output_file = f"{sheet_name}.xlsx"
    df.to_excel(output_file, index=False, engine='openpyxl')
    
    print(f"Saved {sheet_name} to {output_file}")

if __name__ == "__main__":
  input_file = 'original/unido-magic.xlsx'
  split_excel_sheets(input_file)

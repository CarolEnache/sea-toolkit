import pandas as pd

def xlsx_to_csv(xlsx_file, csv_file):
    df = pd.read_excel(xlsx_file)
    df.to_csv(csv_file, index=False)

# Example usage
xlsx_to_csv('xlsx/UNIDO_MINSTAT_REV_4.xlsx', 'csv/UNIDO_4.csv')

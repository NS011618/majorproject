import csv
import os

# Input CSV file path
input_csv_file = 'mtsamples.csv'

# Output directory for generated CSV files
output_directory = 'output_csv_files'

# Create the output directory if it doesn't exist
os.makedirs(output_directory, exist_ok=True)

# Open the input CSV file with 'utf-8' encoding
with open(input_csv_file, 'r', encoding='utf-8') as csvfile:
    # Create a CSV reader
    reader = csv.reader(csvfile)
    
    # Skip the header row if it exists
    header = next(reader, None)
    
    # Loop through each row in the input CSV file
    for row_index, row in enumerate(reader):
        # Create a new CSV file for this row
        output_csv_file = os.path.join(output_directory, f'output_row_{row_index}.csv')
        
        # Write the row to the new CSV file
        with open(output_csv_file, 'w', newline='', encoding='utf-8') as output_csv:
            writer = csv.writer(output_csv)
            if header:
                writer.writerow(header)
            writer.writerow(row)

print("CSV files generated successfully.")

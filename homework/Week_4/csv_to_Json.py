# csv_to_json.py
#
# minor programeren
#
# writes csv data to jason file
# door: mannus schomaker 10591664

import csv
import json

# open file to read from and open file to write to
csvfile = open('test2.csv', 'r')
jsonfile = open('data.json', 'w')

# read csvfile as a dict
reader = csv.DictReader(csvfile)
print(reader)
temp = []

# write each line to a jason format and dump this in the jason file
for row in reader:
	print(row)
	temp.append(row)
json.dump(temp, jsonfile, indent = 4, separators=(',', ': '))

print(jsonfile)
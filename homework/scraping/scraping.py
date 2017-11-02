
#!/usr/bin/env python
# Name: mannus
# Student number: schomaker
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import re

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # make a matrix with 50 lists with 5 values 
    tv_Matrix = [[0] * 5 for i in range(len(dom.by_tag("div.lister \
    	-item-content")))]
    count = 0

    # put the title, rating, genre, actors and runtime in 1 list in the matrix
    for e in dom.by_tag("div.lister-item-content"):

    	tv_Matrix[count][0] = (e.by_tag("a")[0].content)
    	tv_Matrix[count][1] = e.by_tag("strong")[0].content
    	tv_Matrix[count][2] = (e.by_tag("span.genre")[0].content)
    	
    	# add all actors together and add to matrix + add runtime to matrix
    	actors = ""
    	for a in e.by_tag("p")[2].by_tag("a"):
    		actors =  actors + ", " + a.content

    	tv_Matrix[count][3] = actors.strip(", ")
    	tv_Matrix[count][4] = "".join(x for x in e.by_tag("span.run \
    		time")[0].content if x.isdigit())

    	count += 1


    return tv_Matrix  # replace this line as well as appropriate

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    # write to tvseries.csv first row is the header
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write to tvseries.csv every list 
    for i in range(len(tvseries)):
    	writer.writerow([tvseries[i][0].encode('ascii', 'ignore'), 
    		tvseries[i][1].encode('ascii', 'ignore'), 
    		tvseries[i][2].encode('ascii', 'ignore'), 
    		tvseries[i][3].encode('ascii', 'ignore'), 
    		tvseries[i][4].encode('ascii', 'ignore')])



    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
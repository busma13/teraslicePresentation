.PHONY: all clean data help tipcs cleandata cleantopics

help:
	@echo "all - do all setup, gets kafka and data and processes data"
	@echo "clean - deletes temp/"

all: data

clean:
	rm -rf temp/

data: temp/noaa-2016-sorted.json

temp/noaa-2016-sorted.json: temp/noaa-2016.json
	@echo "This step requires lots of memory or will take a long time"
	jq -s 'sort_by(.date) | .[]' -c temp/noaa-2016.json  > temp/noaa-2016-sorted.json

temp/noaa-2016.json: temp/2016-sorted.csv temp/ghcnd-stations.txt temp/ghcnd-countries.txt temp/ghcnd-states.txt
	@echo "This step requires lots of memory or will take a long time"
	cd temp; python3 ../process.py; mv documents.json noaa-2016.json

temp/2016-sorted.csv: temp/2016.csv
	@echo "This step requires lots of memory or will take a long time"
	sort --field-separator=',' --key=1,2 -o temp/2016-sorted.csv temp/2016.csv

temp/2016.csv: temp/2016.csv.gz
	gunzip -k temp/2016.csv.gz

temp/2016.csv.gz:
	wget -P temp/ -nc ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/daily/by_year/2016.csv.gz

temp/ghcnd-stations.txt:
	wget -P temp/ -nc ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-stations.txt

temp/ghcnd-countries.txt:
	wget -P temp/ -nc ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-countries.txt

temp/ghcnd-states.txt:
	wget -P temp/ -nc ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/daily/ghcnd-states.txt

temp:
	mkdir temp

getassets: autoload/elasticsearch-v3.5.0-node-14-bundle.zip autoload/file-v2.2.2-node-14-bundle.zip autoload/kafka-v3.3.1-node-14-bundle.zip autoload/standard-v0.21.0-node-14-bundle.zip

autoload/elasticsearch-v3.5.0-node-14-bundle.zip:
	wget -P autoload/ -nc https://github.com/terascope/elasticsearch-assets/releases/download/v3.5.0/elasticsearch-v3.5.0-node-14-bundle.zip

autoload/file-v2.2.2-node-14-bundle.zip:
	wget -P autoload/ -nc https://github.com/terascope/file-assets/releases/download/v2.2.2/file-v2.2.2-node-14-bundle.zip

autoload/kafka-v3.3.1-node-14-bundle.zip:
	wget -P autoload/ -nc https://github.com/terascope/kafka-assets/releases/download/v3.3.1/kafka-v3.3.1-node-14-bundle.zip

autoload/standard-v0.21.0-node-14-bundle.zip:
	wget -P autoload/ -nc https://github.com/terascope/standard-assets/releases/download/v0.21.0/standard-v0.21.0-node-14-bundle.zip

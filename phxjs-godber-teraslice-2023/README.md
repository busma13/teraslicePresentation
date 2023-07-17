# Code to accompany Teraslice Presentation

These instructions are rough, but should work if you have all of the
dependencies installed.  The demo was prepared on MacOS (Homebrew) using Docker.

Some of the dependencies are:

* `make`
* `Docker`
* `wget`
* `bunyan` (Optional, `npm install -g bunyan`)
* `teraslice-cli`

NOTE: The `Makefile` has a bunch of extra junk in it for generating the data
file from source, but if you're following these instructions you won't need
those, since you'll be grabbing the prepared example data.

## Running Locally

To get things going locally, the first thing we need to do is pull down
Teraslice assets and data.  Warning the data file for this is going to be over
3GB.

```bash
# grab the teraslice assets to autoload them into teraslice on start
make getassets
# grab the data files
make data
```

Now we need to download and build all of the docker containers:

```bash
# this should download, build and start all needed containers in the background
docker compose up -d --build

# wait a bit and check all containers are running and are "healthy"
docker compose ps

# you can inspect the logs for each container this way; CTRL+c to exit
docker compose logs -f elasticsearch
docker compose logs -f --no-log-prefix teraslice-master | bunyan
docker compose logs -f --no-log-prefix teraslice-worker | bunyan
```

## Check Services

After things have started up, you can verify functionality of all of the
services using the following commands:

```bash
# check elasticsearch
curl http://localhost:9200/_cat/indices
# check teraslice
curl http://localhost:5678
# check kafka, list topics
docker compose exec shell kcat -L -b kafka:9092
# how to get a shell in the shell container
docker compose exec -it shell bash
```

Note, if you don't see JSON info from Teraslice, for instance you may see
`curl: (52) Empty reply from server`, then restart the teraslice master with:

```bash
docker compose restart teraslice-master
```

Then check again.

### Running fake_stream.sh

Now that all of the services are running, check for the data file and start
the long running `fake_stream.sh` script in one terminal, this will run until
it has written all the data, which will take many hours (like a day):

```bash
# make sure the data file is available inside the `shell` container
# if it is not, stop and review steps, it should be in temp/ on the host
docker compose exec -it shell ls -l /tmp/data/noaa-2016-sorted.json
# start up the fake_stream.sh script to dribble data into Kafka
docker compose exec -it shell ./fake_stream.sh /tmp/data/noaa-2016-sorted.json
```

In another terminal in the same directory that contains the `docker-compose.yml`
file

```bash
# you should now see testTopic if you list topics in Kafka
docker compose exec shell kcat -L -b kafka:9092

# you can watch the data flowing into the testTopic in Kafka with this
docker compose exec -it shell kcat -C -b kafka -t testTopic
```

You can either open yet another terminal at this point or stop the
`kcat -C ...` command above.

## Teraslice CLI Setup

In order to use the `earl` commands (`teraslice-cli`), you must install the
`teraslice-cli` npm package globally and then configure an alias for the local
Teraslice running at `http://127.0.0.1:5678/`.

```bash
npm install -g teraslice-cli
earl aliases add local http://localhost:5678
```

## Teraslice Example Jobs

Start a job that just reads from the Kafka topic and logs some of the things
it reads.

```bash
earl tjm register local jobs/wx-read-data.json
earl tjm start jobs/wx-read-data.json
# look at the `stdout` output on the worker logs
docker compose logs -f --no-log-prefix teraslice-worker | bunyan
```

If this job runs and you see records written out in the Teraslice worker logs
then you know that everything is setup to work correctly.  Good job!  You can
leave this job running or stop it with the following command.  There's no
need to leave it running to proceed with these instructions.

```bash
earl tjm stop jobs/wx-read-data.json
```

## Using Example Asset

There is an example asset in the `./weather-alert-asset/` directory.  This can
be built, deployed and used as follows:

**UNTESTED**

```bash
# build and upload asset
cd weather-alert-asset
earl assets deploy local --build --replace
cd ..
earl tjm register local jobs/wx-filter-data.json
earl tjm start jobs/wx-filter-data.json
```


## Teraslice Asset Creation

To generate a templated asset

```bash
# generate asset structure
teraslice-cli assets init
# go write asset code, tests and test with ...
yarn test
# generate the asset registry (long story)
teraslice-cli assets init --registry
# build and deploy asset to test teraslice cluster
earl assets deploy local --build --replace
```

## Teraslice Extra Example Jobs

Register and start Teraslice job

```bash
earl tjm register local jobs/data-generator-to-kafka.json
earl tjm start jobs/data-generator-to-kafka.json
```

At this point you'll start seeing records in the `test1` kafka topic, you can
use `kcat` in the `shell` container to read some of those records out:

```bash
docker compose exec shell kcat -C -b kafka:9092 -t test1 -c 5 -e
```

## Teardown

When you're done, you can clean up all of the Docker stuff with this command:

```bash
docker compose down -v --remove-orphans
```

then remove this directory ... or run `make clean` if you just want to clean up
the `temp/` directory with the large data files.

# Code to accompany Teraslice Presentation

## Running Locally

```bash
make getassets
docker compose up -d --build
docker compose logs -f --no-log-prefix teraslice-master | bunyan
```

Check Services

```bash
# check elasticsearch
curl http://localhost:9200/_cat/indices
# check teraslice
curl http://localhost:5678
# check kafka
docker compose exec shell kafkacat -L -b kafka:9092
# how to get a shell in the shell container
docker compose exec -it shell bash
```

### Running fake_stream.sh

```bash
# in one terminal
docker compose exec -it shell ./fake_stream.sh /tmp/data/noaa-2016-sorted.json
# in another terminal
docker compose exec -it shell kafkacat -C -b kafka -t testTopic
```

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
use `kafkacat` in the `shell` container to read some of those records out:

```bash
docker compose exec shell kafkacat -C -b kafka:9092 -t test1 -c 5 -e
```

## Teardown

```bash
docker compose down -v --remove-orphans
```

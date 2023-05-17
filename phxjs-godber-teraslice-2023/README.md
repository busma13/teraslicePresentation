# Code to accompany Teraslice Presentation

## Running Locally

```bash
make getassets
docker compose up -d
docker compose logs -f --no-log-prefix teraslice-master | bunyan
```

Check Services

```bash
# check elasticsearch
curl http://localhost:9200
# check teraslice
curl http://localhost:5678
# check kafka
docker compose exec shell kafkacat -L -b kafka:9092
# how to get a shell in the shell container
docker compose exec -it shell bash
```

### Running fake_stream.sh

```bash
./fake_stream.sh /tmp/data/2016-sorted.csv
kafkacat -b kafka -t testTopic
```

## Teraslice Example Jobs

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

'use strict';

const { BatchProcessor } = require('@terascope/job-components');

class FilterById extends BatchProcessor {
    onBatch(dataArray) {
        let results = [];

        dataArray.forEach((doc) => {
            if (doc.stationId === this.opConfig.stationId) {
                results.push(doc);
            }
        });
        return results;
    }
}

module.exports = FilterById;

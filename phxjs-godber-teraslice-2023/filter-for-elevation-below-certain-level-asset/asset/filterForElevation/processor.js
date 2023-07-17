"use strict";

const { BatchProcessor } = require("@terascope/job-components");

class FilterForElevationBelowCertainLevel extends BatchProcessor {
    onBatch(dataArray) {
        let results = dataArray.slice();

        results = results.filter(
            (item) => item.station.elevation < this.opConfig.elevation
        );
        return results;
    }
}

module.exports = FilterForElevationBelowCertainLevel;

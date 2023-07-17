"use strict";

const { BatchProcessor } = require("@terascope/job-components");

class FilterForElevationBelowCertainLevel extends BatchProcessor {
    onBatch(dataArray) {
        let results = dataArray.slice();

        results.filter(
            (item) => item.station.elevation < this.opConfig.elevation
        );

        return results;
    }
}

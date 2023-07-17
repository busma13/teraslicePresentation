"use strict";

const { ConvictSchema } = require("@terascope/job-components");

class Schema extends ConvictSchema {
    build() {
        return {
            elevation: {
                doc: "An elevation to filter by",
                default: "number",
                format: "Number",
            },
        };
    }
}

module.exports = Schema;

'use strict';

const { ConvictSchema } = require('@terascope/job-components');

class Schema extends ConvictSchema {
    build() {
        return {
            stationId: {
                doc: 'A station ID to match',
                default: 'string',
                format: 'String',
            }
        };
    }
}

module.exports = Schema;

"use strict";

const { DataEntity } = require("@terascope/utils");
const { OpTestHarness } = require("teraslice-test-harness");
const Processor = require("../asset/filterForElevation/processor.js");
const Schema = require("../asset/filterForElevation/schema.js");

const testData = [
    DataEntity.make(
        { TMAX: 27.5, station: { elevation: -22 } },
        { _id: "5df4a1a5-b420-408e-9ce5-9f3c26983dbc" }
    ),
    DataEntity.make(
        { TMAX: 44.5, station: { elevation: 1 } },
        { _id: "c5c1d731-8430-4306-8a4a-dd9d2085ea25" }
    ),
    DataEntity.make(
        { TMAX: 24.5, station: { elevation: -1 } },
        { _id: "a956e6b1-a68d-46ab-8d12-e42b995874ce" }
    ),
    DataEntity.make(
        { TMAX: 45.5, station: { elevation: 0 } },
        { _id: "c9f06393-6967-4b68-a6ad-a8641ca7c4d3" }
    ),
];

const testDataResults = [
    DataEntity.make(
        { TMAX: 27.5, station: { elevation: -22 } },
        { _id: "5df4a1a5-b420-408e-9ce5-9f3c26983dbc" }
    ),
    DataEntity.make(
        { TMAX: 24.5, station: { elevation: -1 } },
        { _id: "a956e6b1-a68d-46ab-8d12-e42b995874ce" }
    ),
];

describe("filterByElevationBelowCertainLevel should", () => {
    const testHarness = new OpTestHarness({ Processor, Schema });

    const opConfig = {
        _op: "filterByElevation",
        elevation: 0,
    };

    beforeAll(async () => {
        await testHarness.initialize({ opConfig });
    });

    it("generate an empty result if no input data", async () => {
        const results = await testHarness.run([]);
        expect(results.length).toBe(0);
    });

    it("filter out stations at elevations above sea level", async () => {
        const results = await testHarness.run(testData);
        expect(results).toEqual(testDataResults);
    });
});

const express = require('express');
const client = require('prom-client');

const app = express();

const restResponseTimeHistogram = new client.Histogram({
    name: "response_time_seconds",
    help: "REST API response time in seconds",
    labelNames: ['method', 'route', 'status_code']
});

function startMetricsServer() {
    const collectDefaultMetrics = client.collectDefaultMetrics;
    // This function collects some default system and process metrics (like memory usage, CPU usage, etc.) from Node.js
    collectDefaultMetrics();

    // client.register is an instance of the Prometheus register that keeps track of all the metrics you've defined
    app.get('/metrics', async (req, res) => {
        // This sets the correct content type for Prometheus to scrape. Prometheus expects the response to be in a specific Prometheus text-based format.
        res.set("Content-Type", client.register.contentType);

        // A function that gathers all the registered metrics and returns them in the correct format that Prometheus expects
        return res.send(await client.register.metrics());
    });

    app.listen(9100, () => {
        console.log('Metrics server started at http://localhost:9100');
    });
}

module.exports = {
    restResponseTimeHistogram,
    startMetricsServer
};

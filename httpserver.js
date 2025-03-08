const express = require('express');
const path = require('path');
const { startMetricsServer, restResponseTimeHistogram } = require('./utils/metrics');
const responseTime = require('response-time');

const app = express();
const port = 3000;

const replicaApp = process.env.APP_NAME;

let count = 0;
//middleware's code need to be placed before the routes 
app.use(responseTime((req, res, time) => {
    console.log("middleware running")
    if (req?.route?.path) {
        restResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode
        }, time / 1000);
    }
}));


// Serve the index.html file when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    count += 1;
    console.log(`Request ${count} served!`);
});

// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server ${replicaApp} is running at http://localhost:${port}`);

    startMetricsServer();
});

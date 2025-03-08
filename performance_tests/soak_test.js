// A soak test is designed to test how a system behaves under a sustained load over an extended period of time. 
// The goal is to ensure that the system can handle continuous use without performance degradation or failure. It typically checks for issues like 
// memory leaks, resource exhaustion, or slow performance under prolonged usage.

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1h', target: 10 },  // Start with 10 users and keep them for 1 hour
    ],
};

export default function () {
    // Send a GET request to the server
    let res = http.get('http://localhost:4000');

    // Optionally log the response status to make sure it's working correctly
    if (res.status !== 200) {
        console.error(`Request failed! Status: ${res.status}`);
    }

    // Sleep for 1 second before the next request
    sleep(1);
}

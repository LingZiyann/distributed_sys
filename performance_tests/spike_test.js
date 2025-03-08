import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '10s', target: 10 },   // Start with 10 users
        { duration: '10s', target: 500 },  // Spike to 500 users in 10 sec
        { duration: '30s', target: 500 },  // Hold at 500 users
        { duration: '10s', target: 10 },   // Scale down to 10 users
        { duration: '10s', target: 0 },    // Gradually cool down to 0 users
    ],
};

export default function () {
    let res = http.get('http://localhost:3000');

    // Optional: Check response status
    if (res.status !== 200) {
        console.error(`Request failed! Status: ${res.status}`);
    }

    sleep(1); // Prevents users from spamming too fast
}

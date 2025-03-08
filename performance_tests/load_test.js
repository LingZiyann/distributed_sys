import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 1 },   // Start with 1 user
        { duration: '2m', target: 50 },  // Gradually ramp up to 50 users
        { duration: '5m', target: 50 },  // Hold at 50 users for 5 minutes
        { duration: '1m', target: 0 },   // Gradually ramp down to 0 users
    ],
};

export default function () {
    let res = http.get('http://localhost:3000');

    if (res.status !== 200) {
        console.error(`Request failed! Status: ${res.status}`);
    }

    sleep(1);
}

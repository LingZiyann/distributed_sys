// A stress test is designed to test the limits of a system by pushing it beyond its normal operational capacity. 
// The goal is to determine the breaking point of the system, identify failure points, and observe how the system behaves when it undergoes excessive load 

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '2m', target: 100 },  // Ramp up from 0 to 100 users (virtual users) in 2 min
        { duration: '5m', target: 100 },  // Hold at 100 users for 5 min
        { duration: '2m', target: 200 },  // Ramp up to 200 users in 2 min
        { duration: '5m', target: 200 },  // Hold at 200 users for 5 min
        { duration: '3m', target: 150 },  // Gradually decrease to 150 users
        { duration: '5m', target: 150 },  // Hold at 150 users
        { duration: '2m', target: 50 },   // Slowly decrease load to 50 users
        { duration: '3m', target: 50 },   // Hold at 50 users for stability
        { duration: '2m', target: 0 },    // Gradually cool down to 0 users
    ]
    
}

const API_BASE_URL = 'http://localhost:3000'

//runs during the tests
export default function () {
    http.batch([
        ['GET', API_BASE_URL]
    ])
};
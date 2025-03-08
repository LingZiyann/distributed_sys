import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,

    //virtual users
    vus: 1,
    duration: '10s'
}

//runs during the tests
export default function () {
    http.get('http://localhost:3000')
    //so api gets called once per second
    sleep(1)
};
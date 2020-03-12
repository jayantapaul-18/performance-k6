import http from 'k6/http';
import { check } from "k6";
import { Trend } from 'k6/metrics';
import { Rate } from 'k6/metrics';
export let errorRate = new Rate("errors");
import { group } from 'k6';

export let options = {
  thresholds: {
    errors: ["rate<0.1"], // <10% errors
    'failed requests': ['rate<0.1'], // threshold on a custom metric
    'http_req_duration': ['p(95)<500']  // threshold on a standard metric
  }
};

const myFailRate = new Rate('failed requests');
let myRate = new Rate('my_rate');
let myTrend = new Trend('waiting_time');

export default function() {
  var url = 'http://192.168.0.37:3005/app/process';
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  var res = http.get(url, params);
  console.log('Response time was ' + String(res.timings.duration) + ' ms');
  const result = check(res, {"is status 200": r => r.status === 200});
  myFailRate.add(res.status !== 200);
  errorRate.add(!result);
  myTrend.add(res.timings.waiting);
  myRate.add(true);
  myRate.add(false);

  group('user flow: RaspberryPi', function() {
    group('healthcheck', function() {
        var url1 = 'http://192.168.0.37:3005/app/healthcheck';
        var res = http.get(url1, params);
    });
    group('app-name', function() {
        var url2 = 'http://192.168.0.37:3005/app/name';
        var res = http.get(url2, params);
    });
  });

}
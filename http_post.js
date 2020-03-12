import http from 'k6/http';

export default function() {
  var url = 'http://192.168.0.37:3005/app/process';
  var payload = JSON.stringify({
    email: 'test@test',
    password: 'test',
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
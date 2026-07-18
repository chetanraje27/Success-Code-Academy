const https = require('https');

const data = JSON.stringify({
  mobileNumber: '9699062427'
});

const options = {
  hostname: 'success-code-academy.onrender.com',
  port: 443,
  path: '/api/v1/auth/send-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();

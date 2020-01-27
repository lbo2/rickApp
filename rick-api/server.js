const express = require('express');
const app = express();
var request = require('request');
const bodyParser = require('body-parser');

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE. SET');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, SET');
    next();
});

var resp = function (res, data, code, next) {
  res.status(code).json(data);
  return next();
};

app.get('/healthcheck', (req, res, next) => {
  const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
    console.log(healthcheck);
    response = {err: false, response: healthcheck}
    resp(res, response, 200, next);
		res.send();
	} catch (e) {
    response = {err: true, response: e}
    resp(res, response, 503, next);
	}
});

// REGISTER USER
app.post('/user/add', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let response;
  client.exists(email, (err, reply) => {
    if (reply === 1) {
        console.log('exists');
        response = {err: true, response: "Email already exists"}
        resp(res, response, 400, next);
    } else {
      client.hmset(email, [
          'email', email,
          'password', password
      ], (err) => {
          if(err) {
            response = {err: true, response: "User was not added successfully "};
            resp(res, response, 400, next);
          } else {
            response = {err: false, response: "Data was added successfully "};
            resp(res, response, 200, next);
          }
      });
    }
  });
});

// LOGIN
app.post('/user/login', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let response;

  client.hgetall(email, (err, reply) => {
    if(err) {
      response = {err: true, response: "Error"};
      resp(res, response, 400, next);
    } else if(reply === null) {
      response = {err: true, response: "User was not found"};
      resp(res, response, 200, next);
    } else {
      if(password === reply.password) {
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        client.set(token, Date.now() + (2 * 60 * 1000));
        client.expire(token, 120);
        response = {err: false, response: "User found successfully ", token: token};
        resp(res, response, 200, next);
      } else {
        response = {err: true, response: "Email and password do not match "};
        resp(res, response, 200, next);
      }

      
    }
  });
});

// GET MORTY DATA
app.post('/getdata', (req, res, next) => {
  var token = req.body.token;
  let response;

  if(token == null) {
    response = {err: true, response: "Invalid session", data: null};
    resp(res, response, 200, next);
  } else {
    client.get(token, (err, reply) => {
      if(reply === null) {
        response = {err: true, response: "session expired"}
        resp(res, response, 200, next);
      } else {
        client.expire(token, 120);
        request.get("https://rickandmortyapi.com/api/character/", (err, response, body) => {
          if (!err){
            let results = JSON.parse(body).results;
            let data = [];
            results.forEach(character => {
              data.push({
                  name: character.name,
                  status: character.status,
                  species: character.species,
                  gender: character.gender,
                  image: character.image
              })
            });
            console.log(data);
            response = {err: false, response: "Data found ", data: data};
            resp(res, response, 200, next);
          }else{
            response = {err: true, response: "Could not found data "};
            resp(res, response, 400, next);
          }
      });
      }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

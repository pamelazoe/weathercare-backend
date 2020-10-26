const fetch = require('node-fetch');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  const { country, city } = req.body;
  const url = `http://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_APIKEY}&q=${city}, ${country}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      //   console.log(data);
      return res.status(data.cod).send(data);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  //   res
  //     .status(200)
  //     .send(`Hello ${name}, ${age} years old, likes color ${color}!`);
};

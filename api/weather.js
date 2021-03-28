const fetch = require("node-fetch");
const url = require("url");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const queryObject = url.parse(req.url, true).query;
  const { city, country } = queryObject;

  const getClimate = async (city, country) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_APIKEY}&q=${city}, ${country}&units=metric`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => err);
  };
  const uvIndex = async (coordinates) => {
    const { lat, lon } = coordinates.coord;
    return fetch(
      `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_APIKEY}`
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => err);
  };
  const fullData = async () => {
    const one = await getClimate(city, country).catch((err) => err);
    console.log(one.weather);
    const two = await uvIndex(one).catch((err) => err);
    return { ...one, city, country, uvIndex: two };
  };

  fullData()
    .then((data) => {
      // console.log(data);
      res.status(data.cod).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(err.cod).send(err.message);
    });
};

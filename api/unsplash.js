const fetch = require("node-fetch");
const url = require("url");
let status;

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const queryObject = url.parse(req.url, true).query;
  const { city, fullCountry, orientation } = queryObject;
  console.log(queryObject);
  const getImages = async (city, fullCountry, orientation) => {
    const unsplashUrl = `https://api.unsplash.com/search/photos?client_id=952e8dbcdd684bc7495869e1bfcc2f8eed6f5a3615aecffbafa022acb71b987e&query=${fullCountry} ${city}&orientation=${orientation}&per_page=20`;
    console.log(unsplashUrl);
    return fetch(unsplashUrl)
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => ({ ...data, status }))
      .catch((err) => {
        console.log(err);
        return err;
      });
  };
  const selectRandomItem = (data) => {
    const { status } = data;
    const image = data.results[Math.floor(Math.random() * data.results.length)];
    return { ...image, status };
  };
  const getImageLink = async (city, fullCountry, orientation) => {
    const getAllImages = await getImages(city, fullCountry, orientation);
    const selectImage = await selectRandomItem(getAllImages);
    const { status, description, urls, links, user, tags } = selectImage;
    return selectImage;
  };
  getImageLink(city, fullCountry, orientation)
    .then((data) => {
      console.log(data);
      res.status(status).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(status).send(err);
    });
};

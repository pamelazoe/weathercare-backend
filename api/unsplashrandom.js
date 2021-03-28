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
  const { orientation } = queryObject;
  console.log(queryObject);
  const getImage = async (orientation) => {
    const unsplashUrl = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACC_KEY}&query=landscape&orientation=${orientation}&per_page=20`;
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
  getImage(orientation)
    .then((data) => {
      console.log(data);
      res.status(status).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(status).send(err);
    });
};

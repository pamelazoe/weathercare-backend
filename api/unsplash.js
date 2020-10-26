const fetch = require('node-fetch');
let status;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  const { country, city } = req.body;
  const url = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACC_KEY}&query=${city}&location=${city} ${country}&orientation=landscape`;
  fetch(url)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      //   console.log(data);
      return res.status(status).send(data);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  //   res
  //     .status(200)
  //     .send(`Hello ${name}, ${age} years old, likes color ${color}!`);
};

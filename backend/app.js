console.log("Run Server Here");

import cors from "cors";
import express from "express";

const app = express();
const port = 3000;
app.use(cors());

const makeApiCall = async (apiURL, apiOptions) => {
  try {
    const response = await fetch(apiURL);
    console.log(response);
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

app.all("/api", async (req, res, next) => {
  let url = req.originalUrl;
  url = url.split("api?url=")[1];
  console.log(url);
  try {
    const resObj = await makeApiCall(url, []);
    if (!resObj) {
      res.status(502).send({
        message:
          "Proxy Server received an invalid response from the API server",
      });
    } else {
      const content = await resObj.json();
      res.status(resObj.status).send(content);
    }
  } catch (err) {
    res.status(500).send({
      message: `Proxy server unable to process request due to the following error: \n${err}`,
    });
  }
  next();
});

app.listen(port);
console.log(`Server started at http://localhost: ${port}`);

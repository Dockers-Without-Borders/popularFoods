require('newrelic');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const port = 3002;
const router = require("./routes/routes");
const controller = require('./controller/controller');

app.use(cors());
app.use("/carousel", controller.cassandra.getCarousel)

app.use(express.static(path.join(__dirname, "../client/public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// servers up the same app regardless of what is inputted into the url
app.use('/:name', express.static(path.join(__dirname, '../client/public')))


app.use("/api", router);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

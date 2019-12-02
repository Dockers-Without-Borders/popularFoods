const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const port = 3000;
const router = require('./routes/routes');

app.use(cors());
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
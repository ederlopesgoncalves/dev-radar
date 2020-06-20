const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

require('dotenv').config();

var dbUrl = "mongodb+srv://"
    + process.env.DB_USER + ":" + process.env.DB_PASS
    + "@" + process.env.MONGO_DB_CLUSTER + "/" + process.env.DB_NAME
    +"?retryWrites=true&w=majority";

mongoose.connect(
    dbUrl, 
    {
        useNewUrlParser: true,
          useUnifiedTopology: true
    }
);

// connection failed event handler
mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server! " + err);
});

mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(process.env.SERVER_PORT, () => { console.log('Server is running...') });

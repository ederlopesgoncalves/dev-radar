const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

var config = {
      "USER"     : "<YOUR_MONGO_DB_USER>", 
      "PASS"     : "<YOUR_MONGO_DB_PASS>",
      "DATABASE" : "<YOUR_MONGO_DB_DATABASE>"
};

var dbUrl = "mongodb+srv://"
    + config.USER
    + ":"
    + config.PASS
    + "@cluster0-<CLUSTER_ID>.mongodb.net/"
    + config.DATABASE
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

server.listen(3333, () => { console.log('Server is running...') });

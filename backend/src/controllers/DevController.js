const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async indexById(request, response) {
    const { user_id } = request.params;

    console.log(user_id);

    const dev = await Dev.find({ _id: user_id });

    if (!dev) {
      return response.status(400).json({ error: "Dev does not exists" });
    }

    return response.json(dev);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      try {
        const apiResponse = await axios.get(
          `https://api.github.com/users/${github_username}`
        );

        console.log(apiResponse);
        if (apiResponse.status != 200) {
          return response
            .status(400)
            .json({ error: "Error on save information!" });
        }

        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = parseStringAsArray(techs);

        const location = {
          type: "Point",
          coordinates: [longitude, latitude]
        };

        dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location
        });

        // Filtrar as conexões que estão há no máximo 50km de distância
        // e que o novo dev tenha pelo menos uma das tecnologias filtradas
        const sendSocketMessageTo = findConnections(
          { latitude, longitude },
          techsArray
        );

        sendMessage(sendSocketMessageTo, "new-dev", dev);
      } catch (error) {
        return response
          .status(400)
          .json({ error: "Error on find GitHub user information!" });
      }
    }
    return response.json(dev);
  },

  async update(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;
    console.log("Updating: ", github_username);

    const dev = await Dev.findOne({ github_username });

    const { _id } = dev;
    console.log(_id);

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    console.log(techsArray);
    console.log(location);

    const filter = { _id };
    const update = {
      techs: techsArray,
      location
    };

    await dev.updateOne({
      techs: techsArray,
      location
    });

    dev.techs = techsArray;
    dev.location = location;

    console.log(dev);
    console.log("Updated....................");

    return response.json(dev);
  }
};

//require('dotenv').config(); // Configure environment variables
require("dotenv").config({ path: ".example.env" }); // Manage environment variables
const Server = require('./models/server');


const server = new Server();



server.listen();
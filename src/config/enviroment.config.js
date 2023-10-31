import dotenv from "dotenv";
import {Command} from "commander";

const command = new Command;

command.option("--dev", "Entorno de trabajo", false)
command.parse();

const enviroment = command.opts().dev;

dotenv.config({path: enviroment ? "./development.env" : "./production.env"});

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    cookie_secret: process.env.COOKIE_SECRET
}
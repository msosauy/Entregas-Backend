import dotenv from "dotenv";
import {Command} from "commander";

const command = new Command;

command.option("--dev", "Entorno de trabajo", false)
command.parse();

const enviroment = command.opts().dev;

dotenv.config({path: enviroment ? "./env.development" : "./env.production"});

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    cookie_secret: process.env.COOKIE_SECRET
}
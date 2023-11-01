import dotenv from "dotenv";
import { Command } from "commander";

const command = new Command();

command.option("--dev", "Entorno de trabajo", false);
command.option("--memory", "Persistencia de trabajo", false);
command.parse();

const enviroment = command.opts().dev;
const persistenceSelected = command.opts().memory? "MEMORY" : "MONGO";

dotenv.config({ path: enviroment ? "./development.env" : "./production.env" });

export default {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  cookie_secret: process.env.COOKIE_SECRET,
  persistence: persistenceSelected,
};
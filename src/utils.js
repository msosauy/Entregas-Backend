import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { fakerES_MX } from "@faker-js/faker";
import env from "./config/enviroment.config.js";

const faker = fakerES_MX;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body);
    let endPath = "/products";
    switch (req.body.event) {
      case "profiles":
        endPath = "/profiles";
        break;
      case "products":
        endPath = "/products";
        break;
      case "documents":
        endPath = "/documents";
        break;
    }
    console.log(endPath);
    cb(null, __dirname + env.upload_files_path + endPath);
  },
  filename: (req, file, cb) => {
    // const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });

export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    id: faker.string.nanoid({ max: 101, min: 1 }),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    stock: +faker.string.numeric(2),
    status: true,
    category: faker.commerce.productAdjective(),
    code: faker.string.alphanumeric(5),
    thumbnails: [faker.image.image(), faker.image.image()],
    active: true,
  };
};

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password); // recibe el password que envía el usuario y que está guardado en BBDD

export default __dirname;

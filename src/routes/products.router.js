import { Router } from "express";
import { authUser, authAdmin, authPremium } from "../auth/authentication.js";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProductById,
  mockingProducts,
  getProductByCode,
} from "../controllers/products.controller.js";

import { productModel } from "../dao/models/productModel.js";

const router = Router();

router.use((error, req, res, next) => {
  next();
});

const products = [
  {
    id: 1,
    title: "Router X1000",
    description: "High-performance router for seamless connectivity.",
    price: 99.99,
    stock: 50,
    category: "Networking",
    code: "RTX1000",
    thumbnails: ["/files/products/img1.jpg"],
    active: true,
  },
  {
    id: 2,
    title: "Switch S200",
    description: "24-port gigabit switch for efficient network management.",
    price: 149.99,
    stock: 30,
    category: "Networking",
    code: "SWT200",
    thumbnails: ["/files/products/img2.jpg"],
    active: true,
  },
  {
    id: 3,
    title: "Dual-Band Wireless Router W450",
    description:
      "Fast and reliable wireless router for home and small office use.",
    price: 79.99,
    stock: 40,
    category: "Networking",
    code: "DRW450",
    thumbnails: ["/files/products/img3.jpg"],
    active: true,
  },
  {
    id: 4,
    title: "Managed Switch M600",
    description: "Advanced 48-port managed switch with VLAN support.",
    price: 249.99,
    stock: 20,
    category: "Networking",
    code: "SMM600",
    thumbnails: ["/files/products/img4.jpg"],
    active: true,
  },
  {
    id: 5,
    title: "Gaming Router G1",
    description: "Optimized router for low-latency gaming experiences.",
    price: 129.99,
    stock: 25,
    category: "Gaming",
    code: "GRG1",
    thumbnails: ["/files/products/img5.jpg"],
    active: true,
  },
  {
    id: 6,
    title: "PoE Switch P800",
    description: "Power over Ethernet switch for simplified installations.",
    price: 179.99,
    stock: 15,
    category: "Networking",
    code: "SPP800",
    thumbnails: ["/files/products/img6.jpg"],
    active: true,
  },
  {
    id: 7,
    title: "Mesh Wi-Fi System M300",
    description: "Whole-home Wi-Fi coverage with mesh technology.",
    price: 199.99,
    stock: 10,
    category: "Networking",
    code: "SWM300",
    thumbnails: ["/files/products/img7.jpg"],
    active: true,
  },
  {
    id: 8,
    title: "Smart Home Router SHR1",
    description: "Router designed for smart home automation and IoT devices.",
    price: 159.99,
    stock: 18,
    category: "Smart Home",
    code: "SHR1",
    thumbnails: ["/files/products/img8.jpg"],
    active: true,
  },
  {
    id: 9,
    title: "10-Port Managed Switch M800",
    description: "High-capacity managed switch with 10 gigabit ports.",
    price: 349.99,
    stock: 12,
    category: "Networking",
    code: "SMM800",
    thumbnails: ["/files/products/img9.jpg"],
    active: true,
  },
  {
    id: 10,
    title: "Compact Wireless Router W200",
    description: "Compact and affordable wireless router for small spaces.",
    price: 49.99,
    stock: 30,
    category: "Networking",
    code: "CRW200",
    thumbnails: ["/files/products/img10.jpg"],
    active: true,
  },
  {
    id: 11,
    title: "PoE+ Switch P1000",
    description: "Power over Ethernet+ switch for high-power devices.",
    price: 249.99,
    stock: 15,
    category: "Networking",
    code: "SPP1000",
    thumbnails: ["/files/products/img11.jpg"],
    active: true,
  },
  {
    id: 12,
    title: "Gaming Switch GS300",
    description: "Switch optimized for low-latency gaming networks.",
    price: 179.99,
    stock: 20,
    category: "Gaming",
    code: "SGS300",
    thumbnails: ["/files/products/img12.jpg"],
    active: true,
  },
  {
    id: 13,
    title: "Wireless Access Point AP500",
    description: "High-performance wireless access point for large spaces.",
    price: 129.99,
    stock: 25,
    category: "Networking",
    code: "SWAP500",
    thumbnails: ["/files/products/img13.jpg"],
    active: true,
  },
  {
    id: 14,
    title: "Enterprise Switch E1200",
    description: "Enterprise-grade switch with advanced security features.",
    price: 499.99,
    stock: 10,
    category: "Networking",
    code: "SEE1200",
    thumbnails: ["/files/products/img14.jpg"],
    active: true,
  },
  {
    id: 15,
    title: "Home Mesh Wi-Fi System HMW450",
    description: "Mesh Wi-Fi system designed for seamless coverage in homes.",
    price: 229.99,
    stock: 15,
    category: "Networking",
    code: "SHMW450",
    thumbnails: ["/files/products/img15.jpg"],
    active: true,
  },
  {
    id: 16,
    title: "Compact PoE Switch P400",
    description:
      "Compact Power over Ethernet switch for small-scale installations.",
    price: 129.99,
    stock: 25,
    category: "Networking",
    code: "CPP400",
    thumbnails: ["/files/products/img16.jpg"],
    active: true,
  },
  {
    id: 17,
    title: "Gaming Router Pro GRP2",
    description: "Professional gaming router with advanced QoS features.",
    price: 199.99,
    stock: 20,
    category: "Gaming",
    code: "GRP2",
    thumbnails: ["/files/products/img17.jpg"],
    active: true,
  },
  {
    id: 18,
    title: "Outdoor Wireless AP OWAP300",
    description: "Weatherproof wireless access point for outdoor environments.",
    price: 149.99,
    stock: 10,
    category: "Networking",
    code: "SOWAP300",
    thumbnails: ["/files/products/img18.jpg"],
    active: true,
  },
  {
    id: 19,
    title: "Smart Switch SS100",
    description:
      "Smart switch with voice control and energy monitoring features.",
    price: 79.99,
    stock: 30,
    category: "Smart Home",
    code: "SS100",
    thumbnails: ["/files/products/img19.jpg"],
    active: true,
  },
  {
    id: 20,
    title: "Business-Class Router BCR700",
    description:
      "Router designed for small to medium-sized businesses with VPN support.",
    price: 299.99,
    stock: 15,
    category: "Networking",
    code: "SBCR700",
    thumbnails: ["/files/products/img20.jpg"],
    active: true,
  },
  {
    id: 21,
    title: "PoE Injector PI200",
    description: "Power over Ethernet injector for powering PoE devices.",
    price: 39.99,
    stock: 40,
    category: "Networking",
    code: "SPI200",
    thumbnails: ["/files/products/img21.jpg"],
    active: true,
  },
  {
    id: 22,
    title: "High-Performance Gaming Switch GS500",
    description: "Top-of-the-line gaming switch with ultra-low latency.",
    price: 249.99,
    stock: 15,
    category: "Gaming",
    code: "SGS500",
    thumbnails: ["/files/products/img22.jpg"],
    active: true,
  },
  {
    id: 23,
    title: "Dual WAN Router DWR300",
    description:
      "Router with dual WAN ports for increased internet reliability.",
    price: 179.99,
    stock: 20,
    category: "Networking",
    code: "SDWR300",
    thumbnails: ["/files/products/img23.jpg"],
    active: true,
  },
  {
    id: 24,
    title: "Compact Gigabit Switch CGS100",
    description:
      "Compact gigabit switch for fast and reliable network connections.",
    price: 59.99,
    stock: 35,
    category: "Networking",
    code: "SCGS100",
    thumbnails: ["/files/products/img24.jpg"],
    active: true,
  },
  {
    id: 25,
    title: "Wireless Range Extender WRE200",
    description:
      "Extend the range of your wireless network with this compact extender.",
    price: 49.99,
    stock: 25,
    category: "Networking",
    code: "SWRE200",
    thumbnails: ["/files/products/img25.jpg"],
    active: true,
  },
];
router.get("/addmockingproducts", (req, res) => {
  products.forEach(async (product) => {
    const newProduct = await productModel.insertMany(product);
  });
  res.send("Productos agregados");
});

//Devuelve todos los productos o la cantidad de productos indicada con query ?limit=number
router.get("/", authUser, getProducts);
// //Busca un producto por ID por params
router.get("/:pid", authUser, getProductById);
//Busca un producto por code por params
router.get("/code/:code", authPremium, getProductByCode);
//Mocking
router.get("/mockingproducts", mockingProducts);
//Agrega un nuevo producto
router.post("/", authPremium, addProduct);
// //Busca un producto por ID y lo modifica
router.put("/:pid", authPremium, updateProduct);
// //Elimina un producto según su ID
router.delete("/:pid", authPremium, deleteProductById);


export default router;

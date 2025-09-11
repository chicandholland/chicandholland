/**
 * Index file for the server application for Rani fashions
 * @dev Written by WEB DEV TEAM - YMTS INDIA
 * @date 24th june 2023
 * @version 1.0.0
 */

import "reflect-metadata"; // reflect-metadata for db
import express from "express"; // express
import db from "./db"; //database
import errorHandler from "./middleware/ErrorHandler"; //error handler
import morgan from "morgan"; // logger
import fs from "fs"; // file system
import cors from "cors"; // cors
import path from "path"; // path
import CONFIG from "./config"; //config file
// -----------------------
// Importing all the controllers
import CategoryRouter from "./controllers/CategoryController";
import SubCategoryRouter from "./controllers/SubCategoryController";
import RoleRouter from "./controllers/RoleController";
import PayerRouter from "./controllers/PayerController";
import ExpenseTypeRouter from "./controllers/ExpenseTypeController";
import ExpenseRouter from "./controllers/ExpenseController";
import InventoryRouter from "./controllers/InventoryController";
import ProductRouter from "./controllers/ProductController";
import EmployeeRouter from "./controllers/EmployeeController";
import OrderRouter from "./controllers/OrderController";
import ReportRouter from "./controllers/ReportController";
import SellerRouter from "./controllers/SellerController";
import AnalyticsRouter from "./controllers/AnalyticsController";
import ContactusRouter from "./controllers/contactusController";
import UserRouter from "./controllers/UserController";
import Clientrouter from "./controllers/ClientsController";
import RetailerRouter from "./controllers/RetailersController";
import CustomerRouter from "./controllers/CustomerController";
import StockRouter from "./controllers/StockController";
import FavouritesRouter from "./controllers/FavouritesController";
import UserRoleRouter from "./controllers/UserRoleController";
import QuickBooksRouter from "./controllers/QuickBooksController";
import ProductColoursRouter from "./controllers/ProductColours";
import Sponsor from "./controllers/SponsorController";
import RetailerOrders from "./controllers/RetailerOrdersController";
import RetailerBank from "./controllers/RetailerBankController";
import AdminBank from "./controllers/AdminBankController";
import CountryController from "./controllers/CountryController";
import PageActions from "./controllers/PageActions";
import Country from "./controllers/CountryController";
import CurrencyRouter from "./controllers/CurrencyController";


// import { createPermissions } from "./models/Permission";
import {
  itemsPerPageHandler,
  minChangeHandler,
  sortHandler,
} from "./middleware/Pagination";

import { memberAuthHandler } from "./middleware/AuthHandler";
import { FOLDER_NAMES } from "./constants";
import cookieParser from "cookie-parser";
import sharp from "sharp";
import fetch from "node-fetch";
import { CacheController } from "./controllers/CacheController";

//  -----------------------
// End of importing controllers

// --------------------
// creating folders
const publicFolder = path.join(process.cwd(), FOLDER_NAMES.STATIC);

const foldersToCreate = [
  FOLDER_NAMES.EXPENSES,
  FOLDER_NAMES.PRODUCTS,
  FOLDER_NAMES.EMPLOYEES,
  FOLDER_NAMES.ORDERS,
];

// end of creating folders
// -----------------

const port = CONFIG.PORT; // default port for the server to listen on

const app = express(); // create a new express app

// Middleware for CORS
const corsConfig = {
  origin: CONFIG.CLIENT_URL,
  credentials: true,
  exposedHeaders: ["set-cookie"],
};
// app.use(cors(corsConfig));
app.use(cors());

// other middleware
app.use(cookieParser()); // cookie parser middleware
app.use(express.json()); // json parser middleware
app.use(morgan("dev")); //logging middleware
app.use(`/${FOLDER_NAMES.STATIC_PATH}`, express.static(publicFolder)); //static files serving middleware

//initialize the database
(async () => {
  try {
    if (!db) throw new Error(`Error initializing the database`);

    // checking if the public folder exists
    if (!fs.existsSync(publicFolder)) {
      fs.mkdirSync(publicFolder);
    }

    // looping over the folder names to create if there are none
    for (const name of foldersToCreate) {
      if (fs.existsSync(path.join(publicFolder, name))) {
        continue; //if the folder exists , we skip the iteration
      }
      fs.mkdirSync(path.join(publicFolder, name)); //creating the folders if there are any
    }

    // initializing the middleware
    await db.initialize();

    // await createPermissions(); //creating default permissions

    //start the server only after the database is initialized
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err: any) {
    console.log("Error occured while connecting to database");
    console.log("Error: ", err.message);
    console.log(err);
  }
})();

// Index route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    health: "Good",
    msg: "Welcome to the API of CHIC AND HOLLAND",
  });
});

app.use(minChangeHandler); // min handler middleware
app.use(itemsPerPageHandler); // items per page middleware
app.use(sortHandler); // sort handler middleware
app.use(memberAuthHandler); // member auth handler middleware

app.use("/api/categories", CategoryRouter);
app.use("/api/subcategories", SubCategoryRouter);
app.use("/api/roles", RoleRouter);
app.use("/api/payers", PayerRouter);
app.use("/api/expensetypes", ExpenseTypeRouter);
app.use("/api/expenses", ExpenseRouter);
app.use("/api/inventory", InventoryRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/reports", ReportRouter);
app.use("/api/analytics", AnalyticsRouter);
app.use("/api/sellers", SellerRouter);
app.use("/api/contactus", ContactusRouter);
app.use("/api/users", UserRouter);
app.use("/api/clients", Clientrouter);
app.use("/api/retailers", RetailerRouter);
app.use("/api/customers", CustomerRouter);
app.use("/api/stock", StockRouter);
app.use("/api/favourites", FavouritesRouter);
app.use("/api/user-roles", UserRoleRouter);
app.use("/api/quickbook", QuickBooksRouter);
app.use("/api/product-colours", ProductColoursRouter);
app.use("/api/sponsors", Sponsor);
app.use("/api/retailer-orders", RetailerOrders);
app.use("/api/retailer-bank", RetailerBank);
app.use("/api/admin-bank", AdminBank);
app.use('/api/countries', CountryController);
app.use("/api/page-actions", PageActions);
app.use("/api/country", Country);
app.use("/api/currencies", CurrencyRouter);
app.post("/api/cache/clear", CacheController.handleClearAll);
app.post("/api/cache/clearByName", CacheController.handleClearByName);
app.get("/api/cache/stats", CacheController.handleGetStats);
app.post("/api/cache/clearKey", CacheController.handleClearKey);
app.post("/api/cache/clearPattern", CacheController.handleClearPattern);
app.get("/api/cache/keyInfo", CacheController.handleGetKeyInfo);

// a route which will read the imageUrl from the request body, read it and convert it into svg format and send it back to the client
app.get("/api/image-to-jpeg", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    res.status(400).json({ msg: "Image url is required" });
    return;
  }

  if (typeof imageUrl !== "string") {
    res.status(400).json({ msg: "Image url is not a string" });
    return;
  }

  try {
    const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

    if (!imageBuffer) {
      res.status(500).json({ msg: "Error fetching image" });
      return;
    }

    const convertedImage = await sharp(imageBuffer)
      .toFormat("jpeg", {
        quality: 40,
      })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", "inline; filename=image.jpeg");
    res.send(convertedImage);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error converting image to svg" });
  }
});

// 404 - Not Found route
app.use("*", async (req, res) => {
  res.status(404).json({
    msg: "Please check the route you are trying to access",
  });
});

// Error handler middleware
app.use(errorHandler);

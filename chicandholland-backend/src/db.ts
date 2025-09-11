import { DataSource } from "typeorm";
import path from "path";
import CONFIG from "./config";

let modelsPath = "";

// for dev use
if (CONFIG.PRODUCTION) {
  // for prod use
  modelsPath = path.join(process.cwd(), "models", "*.js");
} else {
  // for dev use
  modelsPath = path.join(process.cwd(), "src", "models", "*.ts");
}

const db = new DataSource({
  type: "mysql",
  url: CONFIG.DB_URL,
  synchronize: true, //uncomment this line to create tables
  // dropSchema: true, // uncomment this line to drop tables
  entities: [modelsPath],
  // logging: true,
  poolSize: CONFIG.DB_POOL_SIZE,
});

export default db;

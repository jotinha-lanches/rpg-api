import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

const client = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: getSSLValues(),
  },
});

export default client;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      require: true,
      ca: process.env.POSTGRES_CA,
      rejectUnauthorized: true,
    };
  }
  return process.env.NODE_ENV == "production" ? true : false;
}

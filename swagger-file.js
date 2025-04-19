import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerFile = JSON.parse(
  readFileSync(join(__dirname, "./swagger-output.json"), "utf8")
);

export default swaggerFile;

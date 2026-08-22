import dotenv from "dotenv";
import { envSchema } from "../shared/config";

dotenv.config();

export const env = envSchema.parse(process.env);

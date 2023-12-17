import express from "express";
import router from "./router.mjs";
import helmet from "helmet";
import "./helpers/responseInterceptor.mjs";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
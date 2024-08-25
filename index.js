import express from "express";
import dotenv from "dotenv";
import schoolroutes from "./routes/school.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
app.use(express.json());

app.use("/", schoolroutes);
app.listen(PORT, () => {
  "server started";
});

import express from "express";
import { db } from "./db-config.js";
import schoolroutes from "./routes/school.js";
const app = express();
app.use(express.json());
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("db connected");
});

app.use("/", schoolroutes);
app.listen(4000, () => {
  "server started";
});

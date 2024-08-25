import express from "express";
import { queryPromise, db } from "./db-config.js";
const app = express();
app.use(express.json());
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("db connected");
});
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const query = `
            INSERT INTO schools (name, address, latitude, longitude)
            VALUES (?, ?, ?, ?);
        `;
    const values = [name, address, latitude, longitude];

    const result = await queryPromise(query, values);

    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add school" });
  }
};
const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required." });
  }

  const query = `
        SELECT 
            id,
            name,
            address,
            latitude,
            longitude,
            (6371 * acos(
                cos(radians(?)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(?)) + 
                sin(radians(?)) * sin(radians(latitude))
            )) AS distance
        FROM 
            schools
        ORDER BY 
            distance ASC;
    `;

  const results = await queryPromise(query, [latitude, longitude, latitude]);
  console.log(results);
  res.json(results);
};

// Express route
app.post("/addSchool", addSchool);
app.get("/", listSchools);
app.listen(4000, () => {
  "server started";
});

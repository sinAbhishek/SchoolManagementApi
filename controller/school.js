import { queryPromise } from "../db-config.js";

export const addSchool = async (req, res) => {
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
export const listSchools = async (req, res) => {
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

//imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

// set up express
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set up cors
app.use(cors());

//set up multer storage middleware
app.use("/pangolin_api/images", express.static(path.join(__dirname, "images")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//set up server to listen to port
const port = 3000;

async function getSightings(req) {
  let status = 500,
    data = null;
  try {
    const search = req.query.search;
    // if the search parameter is empty, return all the rows
    let sql = "SELECT * FROM sightings ";
    // if there is a search parameter check if it is included in any of values in the database
    if (search.length > 0 && search.length <= 32) {
      // data sanitation using ? to prevent sql injections
      sql += `WHERE deadOrAlive LIKE ? OR deathCause LIKE ? OR location LIKE ? OR notes LIKE ? OR deadOrAlive = ? OR deathCause = ? OR location = ? OR notes = ?`;
      const params = [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ];
      const rows = await db.query(sql, params);

      // return all the rows that match the search parameter
      if (rows) {
        status = 200;
        data = {
          sightings: rows,
        };
        // there are no sightings that match the search
      } else {
        status = 404;
        data = { message: "No Sightings Found." };
      }
      // return all the sightings from the database if there are any
    } else {
      const rows = await db.query(sql);
      if (rows) {
        status = 200;
        data = {
          sightings: rows,
        };
        // there is no content found in the database
      } else {
        status = 204;
        data = { message: "No Content" };
      }
    }
    // there is an error with the server
  } catch (e) {
    status = 500;
    data = { message: "Internal Server Error" };
  }
  return { status, data };
}

async function postSightings(req) {
  let status = 500,
    data = null;
  try {
    // read all the values from the request
    // only set the imagePath if a file was uploaded
    const imagePath = req.file ? req.file.path : "";
    const deadOrAlive = req.body.deadOrAlive;
    const deathCause = req.body.deathCause;
    const location = req.body.location;
    const notes = req.body.notes;
    if (
      // data validation to match the database requirements
      (imagePath && (imagePath.length < 0 || imagePath.length > 64)) ||
      (deadOrAlive !== "Dead" && deadOrAlive !== "Alive") ||
      ![
        "Fence death: electrocution",
        "Fence death: non-electrified fence",
        "Road death",
        "Other",
        "N/A",
      ].includes(deathCause) ||
      (location && (location.length < 0 || location.length > 32)) ||
      (notes && notes.length < 0)
    ) {
      // if the data validation was not passed
      status = 400;
      data = { message: "Invalid Request Parameters" };
      // if all the data passes the validation
    } else {
      // data sanitisation using ? to prevent sql injections
      const sql = `INSERT INTO sightings (imagePath, deadOrAlive, deathCause, location, notes) VALUES (?, ?, ?, ?, ?)`;
      const result = await db.query(sql, [
        imagePath,
        deadOrAlive,
        deathCause,
        location,
        notes,
      ]);
      if (result.affectedRows) {
        status = 201;
        data = { id: result.insertId };
      }
    }
    // there is an error with the server
  } catch (e) {
    status = 500;
    data = { message: "Internal Server Error" };
  }
  return { status, data };
}

//get the sightings from the database
app.get("/pangolin_api", async (req, res) => {
  const { status, data } = await getSightings(req);
  res.status(status);
  if (data) {
    res.setHeader("Content-Type", "application/json");
    // parameters passed to stringify() to pretty print the json
    res.send(JSON.stringify(data, null, 2));
  } else res.end();
});

// post the sighting information to the database
app.post("/pangolin_api", upload.single("image"), async (req, res) => {
  const { status, data } = await postSightings(req);
  res.status(status);
  if (data) {
    // no headers set due to a file being passed along with the json data
    res.json(data);
  } else res.end();
});

// don't allow put requests
app.put("/pangolin_api", async (req, res) => {
  res.status(405);
  res.json({ message: "Method Not Allowed" });
  res.end();
});

// don't allow delete requests
app.delete("/pangolin_api", async (req, res) => {
  res.status(405);
  res.json({ message: "Method Not Allowed" });
  res.end();
});

// set up the port for the app to listen on
app.listen(port, () => {
  console.log("Server listening on port: ", port);
});

//imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db');

// set up express
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

//set up cors
app.use(cors());

//set up multer storage middleware
app.use("/pangolin_api/images", express.static(path.join(__dirname, "images")));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({storage: storage});

//set up server to listen to port
const port = 3000;

async function getSightings(req) {
    let status = 500, data = null;
    try {
        const search = req.query.search;
        // if the search parameter is empty, return all the rows
        let sql = 'SELECT * FROM sightings'
        if (search.length > 0 && search.length <= 32) {
            sql += `WHERE deadOrAlive='${search}' OR deathCause='${search}' OR location='${search}'`;
            // the parameter doesn't pass data validation or sanitation
        } else {
            status = 400;
        }
        const rows = await db.query(sql);
        if (rows) {
            status = 200;
            data = {
                sightings: rows,
            };
        // there is no content that matches the search
        } else {
            status = 204;
            data = [];
        }
    } catch(e) {
        console.error(e);
    }
    return {status, data};
}

async function postSightings(req) {
    let status = 500, data = null;
    try {
        const imagePath = req.file ? req.file.path : null;
        const deadOrAlive = req.body.deadOrAlive;
        const deathCause = req.body.deathCause;
        const location = req.body.location;
        const notes = req.body.notes;
        if (imagePath && deadOrAlive && deathCause && location && notes) {
             const sql = `INSERT INTO sightings (imagePath, deadOrAlive, deathCause, location, notes) VALUES ('${imagePath}', '${deadOrAlive}', '${deathCause}', '${location}', '${notes}')`;
             const result = await db.query(sql);
             if (result.affectedRows) {
                status = 201;
                data = {id: result.insertId};
             }
        } else {
            status = 400;
        }
    } catch(e) {
        console.error(e);
    }
    return {status, data};
}

//test format: https://jk911.brighton.domains/pangolin_api?search=Dead
//get the sightings from the database
app.get("/pangolin_api", async (req, res) => {
    const {status, data} = await getSightings(req);
    res.status(status);
    if (data) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
    } else res.end();
});

// test format: postman
// post the sighting information to the database
app.post("/pangolin_api", upload.single('image'), async (req, res) => {
    const {status, data} = await postSightings(req);
    res.status(status);
    if (data) {
        res.json(data);
    } else res.end();
});

// don't allow put and delete requests
app.put("/pangolin_api", async (req, res) => {
    res.status(405);
    res.end();
});

app.delete("/pangolin_api", async (req, res) => {
    res.status(405);
    res.end();
});

app.listen(port, () => {
    console.log("Server listening on port: ", port);
});
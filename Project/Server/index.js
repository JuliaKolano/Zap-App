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
        let sql = 'SELECT * FROM sightings ';
        if (search.length > 0 && search.length <= 32) {
            sql += `WHERE deadOrAlive LIKE ? OR deathCause LIKE ? OR location LIKE ? OR notes LIKE ?`;
            const params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
            const rows = await db.query(sql, params);

            if (rows) {
                status = 200;
                data = {
                    sightings: rows,
                };
            } else {
                status = 404;
                data = {message: 'No Sightings Found.'}
            }
        } else {
            const rows = await db.query(sql);
            if (rows) {
                status = 200;
                data = {
                    sightings: rows,
                };
            // there is no content found that matches the search
            } else {
                status = 204;
                data = { message: 'No Content'};
            }
        }
    } catch(e) {
        console.error(e);
        status = 500;
        data = { message: 'Internal Server Error'}
    }
    return {status, data};
}

async function postSightings(req) {
    let status = 500, data = null;
    try {
        const imagePath = req.file ? req.file.path : '';
        const deadOrAlive = req.body.deadOrAlive;
        const deathCause = req.body.deathCause;
        const location = req.body.location;
        const notes = req.body.notes;
        if ((imagePath && (imagePath.length < 0 || imagePath.length > 64)) ||
            (deadOrAlive !== 'Dead' && deadOrAlive !== 'Alive') ||
            !['Fence death: electrocution', 'Fence death: non-electrified fence', 'Road death', 'Other', 'N/A'].includes(deathCause) ||
            (location && (location.length < 0 || location.length > 32)) || // Adjust minLength and maxLength accordingly
            (notes && notes.length < 0)) {
            status = 400;
            data = { message: 'Invalid Request Parameters'};
        } else {
            const sql = `INSERT INTO sightings (imagePath, deadOrAlive, deathCause, location, notes) VALUES (?, ?, ?, ?, ?)`;
            const result = await db.query(sql, [imagePath, deadOrAlive, deathCause, location, notes]);
            if (result.affectedRows) {
                status = 201;
                data = {id: result.insertId};
            }
        }
    } catch(e) {
        console.error(e);
        status = 500;
        data = {message: 'Internal Server Error'};
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
    res.json({message: 'Method Not Allowed'});
    res.end();
});

app.delete("/pangolin_api", async (req, res) => {
    res.status(405);
    res.json({message: 'Method Not Allowed'});
    res.end();
});

app.listen(port, () => {
    console.log("Server listening on port: ", port);
});
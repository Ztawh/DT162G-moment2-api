const express = require('express');
const app = express();
const fs = require('fs');

// Sätter att inkommande data är json-objekt
app.use(express.json());
const port = process.env.PORT;
app.use(express.static(__dirname + '/courses'));

// Lyssna på port 3000
app.listen(port, () => {
    console.log(`Example app listening at https://murmuring-ravine-91212.herokuapp.com`)
});

// Sätt headers
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// GET kurser
app.get('/courses', (req, res) => {
    // Läs från fil
    let data = fs.readFileSync("courses.json");
    res.contentType("application/json");
    res.send(data); // Skicka datan till klienten
});

// GET med ID
app.get("/courses/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let ind = -1;

    // Läs från fil och gör till javascript-objekt
    let data = fs.readFileSync("courses.json");
    let courses = JSON.parse(data);

    // Hitta ett matchande ID
    for (let i = 0; i < courses.length; i++) {
        if (courses[i]._id == id) {
            ind = i;
        }
    }

    // Skicka kursen med det angivna ID:t eller tomt om inget hittades
    res.contentType("application/json");
    res.send(ind >= 0 ? courses[ind] : "{}");
});

// DELETE
app.delete("/courses/:id", (req, res) => {
    let id = req.params.id;
    let del = -1;

    // Läs från fil och gör till javascript-objekt
    let data = fs.readFileSync("courses.json");
    let courses = JSON.parse(data);

    // Hitta matchande ID
    for (let i = 0; i < courses.length; i++) {
        if (courses[i]._id == id) {
            del = i;
        }
    }

    // Om ett ID hittas
    if (del >= 0) {
        courses.splice(del, 1); // Ta bort från listan
        let jsonData = JSON.stringify(courses); // Gör till json
        fs.writeFileSync("courses.json", jsonData); // Spara till textfil

        // Skicka meddelande till klienten att det lyckades
        res.contentType("application/json");
        res.status(200).send('{"message" : "Kursen har tagits bort"}');
    } else {
        // Skicka meddelande till klienten att det misslyckades
        res.status(400).send('{"message" : "ID:t kunde inte hittas, ingen kurs togs bort."}');
    }
});

// POST
app.post("/courses", (req, res) => {
    // Läs från fil och gör till javascript-objekt
    let data = fs.readFileSync("courses.json");
    let courses = JSON.parse(data);

    // Lägg till ny kurs i listan
    courses.push(req.body);
    let jsonData = JSON.stringify(courses); // Gör till json
    fs.writeFileSync("courses.json", jsonData); // Skriv till fil

    // Skicka meddelande till klienten att kursen lagts till
    res.contentType("application/json");
    res.status(201).send('{"message" : "Kursen har lagts till"}');
});
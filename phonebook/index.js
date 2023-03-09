const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")

const PORT = 4010

morgan.token("body", function getBody(req) {
    if (req.method == "GET") {
      return req.body = "";
    } else {
      return req.body = JSON.stringify(req.body);
    }
});

let phonebooks = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
]

app.use(cors())
app.use(express.json())

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Custom Middleware
// const requestLogger = (req, res, next) => {
//     console.log(`Method: ${req.method}`)
//     console.log(`Path: ${req.path}`)
//     console.log(`Body: ${req.body}`)
//     console.log("--------------------------------")
//     next()
// }
// app.use(requestLogger);



app.get('/info', (req, res) => {
    const d = new Date()
    const persons = phonebooks.length > 1 ? "people" : "person"
    res.send(`<p>Phonebook has info for ${phonebooks.length} ${persons}</p>
        <p>${d}</p>
        `);
})

app.get('/api/persons', (req, resp) => {
    resp.json(phonebooks);
})

app.get('/api/persons/:id', (req, resp) => {
    const { id } = req.params
    const person = phonebooks.find(person => person.id == id)
    if (person) {
        resp.json(person);
    } else {
        resp.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const foundPerson = phonebooks.find(person => person.id == req.params.id)
    if (foundPerson) {
        const newPhoneBooks = phonebooks.filter((person) => person.id != foundPerson.id);
        phonebooks = newPhoneBooks
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const maxId = Math.floor(Math.random() * 10000000000)
    const body = req.body 
    if (body.name && body.number) {
        const existing = phonebooks.find(person => person.name.toLowerCase() === body.name.toLowerCase())
        if (existing) {
            res.status(400).send({ error: "name must be unique" }); 
        } else {
            body.id = maxId;
            console.log(body);
            phonebooks = [...phonebooks, body];
            res.json(phonebooks);
        }
    }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
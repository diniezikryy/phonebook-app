const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// route for fetching a single resource

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  /* Matches the id of the one in the route and the one
  in the persons array */
  const person = persons.find((person) => person.id === id);

  /* if person data exists, it will be shown, if not, then status error
  404 will be shown instead */
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// route for info

app.get("/info", (request, response) => {
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  response.send(
    `<div>
            <p>Phonebook has info for ${persons.length} people</p>
        </div>
        <div>
            <p>${currentDate} (${timeZone})</p>
        </div>
        `
  );
});

// route to delete single entry

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  /* removes the person from the persons array */
  persons = persons.filter((person) => person.id !== id);

  /* Returns a success response but no data returned */
  response.status(204).end();
});

// route to add a person

const generateId = () => Math.floor(Math.random() * 69);

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

// sets the server on port 3001

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

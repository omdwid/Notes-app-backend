const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // without json parser we cannot access the body of the request

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const getId = () => {
    return 1 + notes.reduce((acc, note) => {
        return Math.max(acc, note.id)
    }, -Infinity)
}


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
})

app.get('/api/notes', (request, response) => {
    response.json(notes);
})

app.get('/api/notes/:id' , (request, response) => {
    const id = Number(request.params.id);
    const resp = notes.filter( note => {
        return note.id === id;
    })

    if(resp.length > 0){
        response.json(resp);
    }
    else{
        response.status(404).end();
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const del_id = Number(request.params.id);
    notes = notes.filter(note => note.id !== del_id);
    console.log(notes)
    response.status(204).end();
})

app.post('/api/notes', (request, response) => {
    const note = request.body;
    if(!note.content){
        response.status(400).json({error: "Content is mandatory"})
        return
    }
    notes.push({
        ...note,
        id: getId()
    })

    response.json(notes.find((note) => note.id == (getId() - 1)))
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')
const app = express()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

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

app.get('/api/notes', (request, response) => {
  Note.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    if(note){
      response.json(note)
      }
      else{
        response.status(404).end();
      }
    })
    .catch(error => {
      next(error)
    })
  })
  
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body
  
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  
  note.save()
  .then(savedNote => {
    response.json(savedNote)
  })
  .catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  
  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important },
    { new: true, runValidators: true, context: 'query' }
    ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.use(errorHandler)
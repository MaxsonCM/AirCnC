const dotenv = require ('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const socketio = require('socket.io')
const http = require('http')

const routes = require('./routes')
dotenv.config ()

const app = express()
const server = http.Server(app)
const io = socketio(server)


mongoose.connect('mongodb+srv://' + process.env.BD_USER + ':' + process.env.BD_PASSWORD + '@' + process.env.BD_HOST + '?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query
    
    connectedUsers[user_id] = socket.id
})

app.use((req,res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
})

// GET, POST, PUT, DELETE

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edição, delete)
//req.body = Acessar corpo da requisição (para criação, edição)

//app.use(cors({origin: 'http://localhost:3333'}))
app.use(cors())
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

server.listen(process.env.PORT)

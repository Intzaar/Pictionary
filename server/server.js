const express = require("express")
const dotenv = require("dotenv").config()
const app = express()
const server = require("http").createServer(app)
const { Server } = require("socket.io")

const io = new Server(server)

app.get("/", (req, res) => {
    res.send("ok")
})

let roomIdGlobal, imgURLGlobal

io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data
        roomIdGlobal = roomId
        socket.join(roomId)
        socket.emit("userIsJoined", { success: true })
        socket.broadcast.to(roomId).emit("BoardDataResponse", {
            imgURL: imgURLGlobal
        })
    })
    socket.on("BoardData", (data) => {
        imgURLGlobal = data
        socket.broadcast.to(roomIdGlobal).emit("BoardDataResponse", {
            imgURL: data
        })
    })
})

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`server is running on port ${port}`))

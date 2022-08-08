const express = require('express');
const mongoose = require('mongoose');
const Comments = require('./models/comment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('./public'));
app.use(express.json());

mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database Connection Error: "));
db.once("open", function () {
    console.log("Database Connected Successfully");
});

app.post('/api/uploadComment', async (req, res) => {
    const newComment = new Comments({
        username: req.body.username,
        comment: req.body.comment,
        date: req.body.date
    })
    try {
        let saveData = await newComment.save();
        res.send(saveData);
    } catch(error) {
        console.log(error)
    }

})

app.get('/api/getAllComments', async (req, res) => {
    const allComments = await Comments.find();
    res.send(allComments);
})

const server = app.listen(PORT, () => {
    console.log(`App Running at Port ${PORT}`);
})

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(`New Connection: ${socket.id}`);
    socket.on('comment', (data) => {
        socket.broadcast.emit('comment', data);
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })
})




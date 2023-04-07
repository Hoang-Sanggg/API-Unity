const http = require('http');
const express = require('express');

const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(courses => courses.id === parseInt(req.params.id));
    if (!course) res.status(404).send('Id not found');
    res.send(course);
});

app.post('/api/courses/add', (req, res) => {
    console.log(req.body);
    const course = {
        id: req.body.id,
        name: req.body.name
    }
    courses.push(course);
    res.send(JSON.stringify({ success: true, notice: 'Course added successfully', data: course }));

});

app.put('/api/courses/edit/:id', (req, res) => {
    const course = courses.find(courses => courses.id === parseInt(req.params.id));
    course.name = req.body.name;
    res.send(JSON.stringify({ success: true, notice: 'Course edited successfully', data: course }));
});

let userss = require('./router/userRouter');
app.use('/api/users', userss)

async function connect() {
    const server = "mongodb+srv://phamhoangsang175:phs20012003@mongodb.5jchqme.mongodb.net/API-Unity?retryWrites=true&w=majority";
    try {
        await mongoose.connect(server);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log(e);
    }
}

connect();

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
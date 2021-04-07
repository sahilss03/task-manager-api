const express = require('express');
const app = express();
require('./db/mongoose');
const multer = require('multer');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const port = process.env.PORT;

// const upload = multer({
//     dest: 'images'
// });
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// });


//automatically parse incoming json to the object
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('server is up on port ', port);
});
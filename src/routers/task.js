const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async(req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks', auth, async(req, res) => {
    const match = {};
    const sort = {};
    match.owner = req.user._id;
    //if completed query is present in url then i will add the query also while finding in the database
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        //.sort after find takes object in which we can first set the key for which we have to sort and value should be 1 for asc and -1 for desc that's the rule in documentation.
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        const tasks = await Task.find(match).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort);
        // const tasks = await Task.find({ owner: req.user._id });
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});
router.get('/tasks/:tp', auth, async(req, res) => {
    const _id = req.params.tp; //done tp to show that i can use any name
    try {
        const tasks = await Task.findOne({ _id, owner: req.user._id });
        if (!tasks) {
            return res.status(404).send();
        }
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});
router.patch('/tasks/:id', auth, async(req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
        return res.status(400).send('Invalid Operation');
    }
    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => {
            return task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
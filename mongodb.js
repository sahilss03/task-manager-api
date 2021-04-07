//CRUD create read update delete
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const ObjectID = mongodb.ObjectID;
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the database');
    }
    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     name: 'Sahil',
    //     age: '19'
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }
    //     //array of document which we inserted
    //     console.log(result.ops);
    // });
    // db.collection('users').insertMany([{
    //         name: 'sahil',
    //         age: '19'
    //     },
    //     {
    //         name: 'Riya',
    //         age: 19
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }
    //     //array of document which we inserted
    //     console.log(result.ops);
    // });
    // db.collection('tasks').insertMany([{
    //         description: 'string1',
    //         completed: true
    //     },
    //     {
    //         description: 'string2',
    //         completed: false
    //     },
    //     {
    //         description: 'string3',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }
    //     //array of document which we inserted
    //     console.log(result.ops);
    // });
    //this is how we can get the data from the database by searching for name and anything
    //it return the first matching result
    // db.collection('users').findOne({ name: 'Sahil', age: '19' }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch');
    //     }
    //     console.log(user);

    // });
    //to search by id
    // db.collection('users').findOne({ _id: new ObjectID("60369a0bd8934a646c340ea6") }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch');
    //     }
    //     console.log(user);

    // });
    //to get all the matching results
    // db.collection('tasks').find({ completed: false }).toArray((error, arr) => {
    //     console.log(arr);
    // });
    // db.collection('tasks').find({ completed: false }).count((error, count) => {
    //     console.log(count);
    // });
    // to update existing data
    // db.collection('users').updateOne({ _id: new ObjectID("60369a0bd8934a646c340ea6") }, {
    //     $set: {
    //         name: 'updated name',
    //     },

    // }).then((result) => {
    //     console.log(result);

    // }).catch((error) => {
    //     console.log(error);
    // });
    db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    });
    //to delete data
    db.collection('tasks').deleteOne({ description: 'string3' }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
});
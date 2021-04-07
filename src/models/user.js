const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email!!");
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot be password");
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('age should be positive!!');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

//it is used to define the relationship between two entities and it is not stored inside the database
//any name instead of tasks also can come
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//statics is used for all the reques in User
userSchema.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({ 'email': email });

    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

//toJSON returns the result which should come after JSON.stringify method.
/*

    const obj={
        name:'pet'
    };
    obj.toJSON=function(){
        return {};
    }
    console.log(JSON.stringify(obj));
    OUTPUT:- empty object because return is {};
*/
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject(); //gives all the user data in the form of object
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//methods is used for individuals requests
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token: token });
    await user.save();
    return token;
}

//this will run just before a user is created and hash the password
userSchema.pre('save', async function(next) {
        let user = this;
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8);
        }
        next();
    })
    //delete user task when the user is removed
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
const { Schema, model, Types } = require('mongoose');

const animalSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [2, 'Name must be at least 2 characters long!'],
    },
    years: {
        type: Number,
        required: [true, 'Animal age is required!'],
        min: [1, 'Age must be a number between 1 and 100!'],
        max: [100, 'Age must be a number between 1 and 100!']
    },
    kind: {
        type: String,
        required: [true, 'Animal kind is required!'],
        minLength: [3, 'Animal kind must be at least 3 characters long!'],
    },
    image: {
        type: String,
        required: [true, 'Animal photo is required!'],
        match: [/^https?:\/\//, 'Image Url is not valid!']
    },
    need: {
        type: String,
        required: [true, 'Animal need is required!'],
        minLength: [3, 'Animal need must be between 3 and 20 characters long!'],
        maxLength: [20, 'Animal need must be between 3 and 20 characters long!'],
    },
    location: {
        type: String,
        required: [true, 'Location is required!'],
        minLength: [5, 'Location must be between 5 and 15 characters long!'],
        maxLength: [15, 'Location must be between 5 and 15 characters long!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [5, 'Description must be between 5 and 50 characters long!'],
        maxLength: [50, 'Description must be between 5 and 50 characters long!'],
    },
    donations: [{
        type: Types.ObjectId,
        default: [],
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
});

animalSchema.path('image').validate(function (value) {
    const regex = /^https?:\/\//
    return regex.test(value);

}, 'Image Url is not valid!');

const Animal = model('Animal', animalSchema);

module.exports = Animal;

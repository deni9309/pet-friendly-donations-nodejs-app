const { MongooseError, Error } = require('mongoose');

exports.getErrorMessage = (err) => {
    if (err instanceof MongooseError || err instanceof Error.ValidationError) {
        return Object.values(err.errors).at(0).message;
    } else {
        return err.message;
    }
};
module.exports = function () {
    const mongoose = require('mongoose');
    const mongo = mongoose.connect('mongodb://localhost:27017/blog',{useNewUrlParser: true});
    return mongo 
}
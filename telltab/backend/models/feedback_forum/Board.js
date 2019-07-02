const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types

var boardSchema = new Schema({
    created: Date,
    name: {type: String, required: true},
    product: ObjectId,
    numPosts: Number,
    url: String
});

var Board = mongoose.model("Board", boardSchema);

module.exports = Board; 
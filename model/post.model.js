const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    author : {
        type : String,
        required : true
    },
    date : {
        type: Date,
        default: Date.now
    },
    image : {
        type : String,
        default : 'img/post_img.jpg'
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    views : {
        type : Number,
        default : 0
    }
});

const Post = mongoose.model('posts', postSchema);

module.exports = Post;
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
 text:{ 
  type: String,
  required: "Text is required"
  },
 createdAt: {
     type: String,
     default: Date.now
 },
 creator : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
videos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }
});

const model = mongoose.model("Comment",CommentSchema);

export default model;
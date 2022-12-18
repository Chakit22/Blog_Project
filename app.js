//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const connectdb = require("./config/connectdb.js");
const mongoose = require("mongoose");
const app = express();
connectdb();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const homeStartingContent = "Hey Guys!! This is my first Blog Website made from scratch. Hope you like it!!";
const aboutContent = "First Blog Website.";
const contactContent = "If you like the content, then please do reach out to me at ";

const postSchema = new mongoose.Schema({
  postTitle:{
    type:String,
    required:true
  },
  postBody:String
});

const Posts = mongoose.model("Post",postSchema);

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/",(req,res) => {
  console.log("Inside /");
  //Check if there exists any posts in the database or not.
  Posts.find({},function(err,posts){
    if(err)
      next(err);
    else{
      if(posts.length === 0){
        res.render("home",{startingContent:"No posts to display!!",posts_home:[]});
      }else{
        res.render("home",{startingContent:"Enjoy reading the posts!!",posts_home:posts});
      }
    }
  });
});

app.get("/about",(req,res) => {
  console.log("Inside /about");
  res.render("about",{about_content:aboutContent});
});

app.get("/contact",(req,res) => {
  console.log("Inside /contact");
  res.render("contact",{contact_content:contactContent});
});

app.get("/compose",(req,res) => {
  console.log("Inside /compose get");
  res.render("compose");
});

app.get("/posts/:postId",function(req,res){
  const postId = req.params.postId;
  Posts.findOne({_id:postId},function(err,post){
    if(err){
      next(err);
    }else{
      if(!post){
        next(new Error("No post with this post Id exists!!"));
      }else{
        res.render("post",{title:post.postTitle,content:post.postBody});
      }
    }
  });
});

app.get("/update/:postId",function(req,res){
  const postId = req.params.postId;
  const deletePost = req.query.deletePost;
  
  if(deletePost){
    Posts.deleteOne({_id:postId},function(err,deletedPost){
      if(err)
      next(err);
      else{
        console.log("deletedPost : ",deletedPost);
        res.redirect("/");
      }
    });
  }else{
    Posts.findOne({_id:postId},function(err,post){
      if(err)
      next(err);
      else{
        if(!post){
          next(new Error("No posts exist by this id!!"));
        }else{
          res.render("updatePost",{title:post.postTitle,postId:post._id});
        }
      }
    });
  }
});

app.post("/compose",async (req,res) => {
  console.log("Inside /compose post");
  try{
    const title = req.body.postTitle;
    const content = req.body.postBody;
  
    const newPost = new Posts({
      postTitle:title,
      postBody:content
    });

    await newPost.save();
    res.redirect("/");
  }catch(err){
    next(err);
    return;
  }
});

app.post("/update",function(req,res){
  const content = req.body.content;
  const postId = req.body.submitValue;

  Posts.updateOne({_id:postId},{$set:{postBody:content}},function(err,post){
    if(err)
      next(err);
    else{
      console.log("Succesfully updated the post!!");
      res.redirect("/");
    }
  });
});

app.use((err,req,res,next)=> {
  res.status(err.status || 500);
  res.send({
      error:{
          status:err.status || 500,
          message:err.message
      }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

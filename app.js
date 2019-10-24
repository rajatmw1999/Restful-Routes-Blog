//Requiring npm packages
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//Initialising
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
//Connecting to mongoose database
mongoose.connect("mongodb://localhost:27017/restfulBlog",{useNewUrlParser: true});

//Constructing Schema and Model for blog posts
const blogSchema = new mongoose.Schema({
  title: String,
  body:String,
  image: String,
  created : {type: Date, default: Date.now}
});

const Blog = new mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Steve Jobs",
//   body: "Jobs was the most complicated and most simplest man in the history of tech entrepreneurship.",
//   image: "https://www.biography.com/.image/t_share/MTY2MzU3OTcxMTUwODQxNTM1/steve-jobs--david-paul-morrisbloomberg-via-getty-images.jpg"
// });


//Restful routes here
app.get('/',function(req,res){
  res.redirect('/blogs');
});


app.get('/blogs',function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log(err);
    }
    else {
      res.render('index',{blogs:blogs});
    }
  });
});


//NEW ROUTE
app.get('/blogs/new',function(req,res){
  res.render('new');
});

//INDEX ROUTE
app.post('/blogs',function(req,res){
  Blog.create(req.body.blog,function(err, newBlog){
    if(err)
    res.render('new');
    else {
      res.redirect('/blogs');
    }
  });
});

//SHOW ROUTE
app.get('/blogs/:id',function(req,res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if(err)
    console.log(err);
    else {
      res.render('show',{blog:foundBlog});
    }
  });
});

//EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      console.log(err);
      res.redirect('/');
    }else{
    res.render('edit',{blog:foundBlog});
    }
  });
});

//UPDATE ROUTE
app.put('/blogs/:id',function(req,res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
    if(err){
      console.log(err);
      res.redirect('/blogs');
    }else{
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

//DESTROY ROUTE
app.delete('/blogs/:id',function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      console.log(err);
      res.redirect('/blogs');
    }
    else {
      res.redirect('/blogs');
    }
  });
});


//Listening to the server
app.listen(3000,function(req,res){
  console.log("Server is running on port 3000");
});

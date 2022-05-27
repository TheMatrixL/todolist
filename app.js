const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

const app = express();
const items = []; // all item save in list
const workItems = []

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); // static to link local file


// create databse
mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = new mongoose.Schema ({  //create Schema (like data structure)
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "this is item1",
  });

const item2 = new Item({
  name: "hit the button to add more",
  });

const item3 = new Item({
  name: "tick the box to delete",
  });

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err) {
  if (err) {
    console.log("err");
  } else {
    console.log("Successfully add all default items");
  }
})





app.get('/', function(req, res) {

  Item.find({}, function(err, fundItems) { //{}meaneverything
    if (err) {
      console.log("err");
    } else {console.log(fundItems)}
  });

  let day = date.getDate(); // call the function that was created by us

  res.render('list', {listTitle: day, newListItems: items}); // listTitle and newListItems are refer to HTML ejs code

});

app.post("/", function(req, res){

  let item = req.body.newItem;

  console.log(req.body);
  if (req.body.list === "Work") {  // use if statement to check listTitle and change post to "/" or "/work"
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }

});

app.get('/work', function(req, res) {
  res.render('list', {listTitle: "Work List", newListItems: workItems})
})

app.get('/about', function(req, res) {
  res.render('about')
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

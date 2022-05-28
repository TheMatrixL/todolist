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
  name: "This is item1",
  });

const item2 = new Item({
  name: "Hit the button to add more",
  });

const item3 = new Item({
  name: "Tick the box to delete",
  });

const defaultItems = [item1, item2, item3]; //in oder to insert many items



app.get('/', function(req, res) {

  let day = date.getDate();

  Item.find({}, function(err, foundItems){ //{}meaneverything

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log("err");
        } else {
          console.log("Successfully add all default items");
        }
      })
      res.redirect('/');
    } else {res.render('list', {listTitle: day, newListItems: foundItems})}

  });

  // res.render('list', {listTitle: day, newListItems: fouundList}); // listTitle and newListItems are refer to HTML ejs code

});

app.post("/", function(req, res){

  let itemName = req.body.newItem;

  const item = new Item({
    name: itemName
    });

  item.save()
  res.redirect("/");

  // if (req.body.list === "Work") {  // use if statement to check listTitle and change post to "/" or "/work"
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox
  let itemName = ""

  Item.findById(checkedItemId, function(err, item){
    if(!err) {
      itemName = item.name;
  }
  });

  Item.findByIdAndRemove(checkedItemId, function (err){
    if (err){
        console.log(err)
    }
    else{
        console.log("(" + itemName + ")" + " has been delete!")
    }
    res.redirect("/")
  })
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

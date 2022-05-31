const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
require('dotenv').config('/.env');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public")); // static to link local file


// create databse
mongoose.connect(process.env.MONGODB_ATLAS);

const itemSchema = new mongoose.Schema({ //create itemSchema
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Hit the button to add more!",
});

const item2 = new Item({
  name: "Tick the box to delete items",
});

const item3 = new Item({
  name: "Create new custom list by adding new list name on the end of url",
});

const defaultItems = [item1, item2, item3]; //in oder to insert many items


const listSchema = new mongoose.Schema({ //create list schema
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

//------------------------------------------------------------------------------

app.get('/', function(req, res) {

  let day = date.getDate();

  Item.find({}, function(err, foundItems) { //{}mean everything

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log("err on /");
        } else {
          console.log("Successfully add all default items");
        }
      })
      res.redirect('/');
    } else {
      res.render('list', {
        listTitle: "ToDoList",
        listDate: day,
        newListItems: foundItems
      })
    }

  });

});

app.get('/about', function(req, res) {
  res.render('about')
})

app.get('/:customListName', function(req, res) {

  let day = date.getDate();

  const customListName = req.params.customListName

  List.findOne({
      name: customListName
    },
    function(err, foundList) {
      if (!err) {
        if (!foundList) {
          // Create new list
          const list = new List({
            name: customListName,
            items: defaultItems
          })
          list.save();
          res.redirect("/" + customListName)
        } else {
          // Show exist list
          //
          res.render("list", {
            listTitle: foundList.name.toUpperCase(),
            listDate: day,
            newListItems: foundList.items
          })
        }
      } else {
        console.log(err);
      }
    }
  );
});



app.post("/", function(req, res) {
  let day = date.getDate();

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "ToDoList") {
    item.save()
    res.redirect("/");
  } else {
    List.findOne({name: listName.toLowerCase()}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName.toLowerCase());
    })
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  const itemName = req.body.itemName;

  if (listName === "ToDoList") {

    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('"' + itemName + '" on ' + listName + " has been deleted!")
        res.redirect("/")
      }

    })
  } else {
      List.findOneAndUpdate({name: listName.toLowerCase()}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if (err) {
          console.log(err);
        } else {
          console.log('"' + itemName + '" on ' + listName + " has been deleted!");
          res.redirect("/" + listName.toLowerCase())
        }
      })
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});

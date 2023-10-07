const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://" + process.env.USERNAME_MONGO + ":" + process.env.PASSWORD + "@cluster0.ytfcbis.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new Item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an Item"
});

const defaultItems = [item1, item2, item3]; 

const listSchema = {
    name: String,
    items : [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/",function(req, res)
{
    async function myItems(){
        const items = await Item.find({});

        if(items.length === 0)
        {
            Item.insertMany(defaultItems).then(function(){
                console.log("Data Inserted");    //Success
            }).catch(function(error){
                console.log(error);              //Faliure
            });
            res.redirect("/");
        }
        else
        {
            res.render("list", {listTitle: "Today", newListItems: items});
        }
    }
    myItems();   
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName})
    .then((docs) =>{
        if(docs === null)
        {
            // console.log("Doesn't Exist");
            //Create a new list
            const list = new List({
                name: customListName,
                items: defaultItems
            });
        
            list.save();
            res.redirect("/" + customListName);
        }
        else
        {
            // console.log("Found List");
            //Show an existing list
            res.render("list", {listTitle: docs.name, newListItems: docs.items});
            
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    }
    next();
}
app.use(ignoreFavicon);


app.post("/", function(req, res){

    let itemName = req.body.newItem;
    let listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today")
    {
        item.save();
        res.redirect("/");
    }
    else
    {
        List.findOne({name: listName})
        .then((foundList) => {
            if(foundList === null)
            {
                console.log("List not found");
            }
            else
            {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
});

app.post("/delete", function(req,res){
    const checkedItemId =  req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today")
    {
        Item.deleteOne({_id: checkedItemId}).then(result => {
            console.log(result);
        });
    
        res.redirect("/");
    }
    else
    {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        .then((foundList) => {
            if(foundList === null)
            {
                console.log("List not found");
            }
            else
            {
                res.redirect("/" + listName);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    
});

app.get("/about", function(req, res)
{
    res.render("about");
});

// app.listen(3000, function()
// {
//     console.log("Server started on port 3000...");
// });

app.listen(PORT, function()
{
    console.log("Server started on port ${PORT}");
});



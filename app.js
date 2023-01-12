const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');  

app.use(express.static("public"));
const port = process.env.PORT;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://admin-ayush:Ayush@cluster0.ebimjsf.mongodb.net/todolistDB", () => {
    console.log("Connected to MongoDB");
})

// first collection Schema.
const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// second collection Schema.
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
    const day = date.getDate();
    
    Item.find((err, foundItems) => {
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,(err) => {
                if(err) console.log(err);
                else  console.log("Successfully saved dafault items to DB");
            })
            res.redirect("/");
        }
        else
            res.render("list", {listTitle: "Today", newListItems: foundItems});
    })
})


app.get("/:customListName", (req, res)=>{
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName}, (err, foundList)=>{
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);
            }
            else
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
        else    
            console.log(err);
    })
    

})

app.post("/", function(req, res){
    
    const itemName = req.body.newItem;
    const listName = _.capitalize(req.body.list);

    const item = new Item({
        name: itemName
    })

    // if(listName === date.getDate()){        
    if(listName === "Today"){        
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName}, (err, foundList)=>{
            if(!err){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
            else
                console.log(err);
        })
    }
})

app.post("/delete", (req, res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    // if(listName === date.getDate()){ 
    if(listName === "Today"){ 
        Item.findByIdAndDelete(checkedItemId, (err)=>{
            if(err) console.log(err);
            else console.log("Item deleted");
        })
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=>{
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }


    // Item.deleteOne({_id:checkedItemId},(err)=>{
    //     if(err) console.log(err);
    //     else console.log("Item deleted");
    // })
})


// app.post("/work", function(req, res){
//     let item = req.body.newItem;
// })

app.get("/about", function(req, res){
    res.render("about");
})


app.listen(port || 3000, function(){
    console.log("Server is running on port 3000");
})





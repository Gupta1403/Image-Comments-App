const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const imageCommentsData = require("./data.json");
const port  = process.env.PORT || 8080; //Step-1
const path = require('path');

// configuring Mongoose
mongoose.Promise = global.Promise;//
mongoose.set('useCreateIndex', true)

// let url ="mongodb://localhost:27017/ImageCommentsDB";
let url ='mongodb+srv://sai_guptha:sai_guptha@cluster0.qfjxv.mongodb.net/ImageCommentsDB?retryWrites=true&w=majority'
let schema = mongoose.Schema({
    imageName : String,
    imageURL: String,
    altText : {type : String, default :'Default alt text'},
    pointCommentsArr : [{
        left: Number,
        top :Number,
        comment :String
    }]
}, {collection : "ImageComments" })

let getImageCommentsCollection = async () => {
    return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology:true }).then((database) => {
        return database.model('ImageComments', schema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}
app.use(cors());
app.use(express.static("./public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//Image Comments initial data setup
app.get("/setupDb", async (req, res) => {
    try {
        let dbCollection = await getImageCommentsCollection();
        try {
            await dbCollection.deleteMany({});
            let insertedRes = await dbCollection.insertMany([...imageCommentsData]);
            if(insertedRes.length > 0){
                res.send('Successfull inserted ' + insertedRes.length + ' documents' )
            }
        } catch (error) {
            res.status(404);
            res.send({"message":error.message});        
        }
    } catch (error) {
        res.status(404);
        res.send({"message":error.message});
    }
})

//sends entire data of images
app.get("/imagesComments", async(req, res) =>{
    let dbCollection = await getImageCommentsCollection();
    let findRes = await dbCollection.find({});
    if(findRes.length > 0){
        res.send(findRes);
        mongoose.connection.close();
    }else{
        res.status(404);
        res.send({message : 'Data not found'})
    }
});

app.put("/pointComment", async(req ,res )=>{
    let { _id ,newCommentTobeAdded} = req.body;
    let dbCollection = await getImageCommentsCollection();
    let updateRes = await dbCollection.updateOne({ _id },{ $push: { pointCommentsArr : newCommentTobeAdded } });
    if(updateRes.nModified > 0){
        res.send('Added new Comment')
        mongoose.connection.close()
    }else{
        res.status(400);
        res.send('Adding comment failed!.Please try again')
    }
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static( 'Image-Tag-App-UI/build' ));
    app.get( '*', (req, res) => {
        res.sendFile( path.join(__dirname, 'Image-Tag-App-UI', 'build') )
    } )
}

app.listen(port, () => console.log(`Server started at port ${port}`));
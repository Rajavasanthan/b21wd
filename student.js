const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const URL = "mongodb+srv://vasanth:user123@cluster0.rdv5i.mongodb.net?retryWrites=true&w=majority";
const DB = "b21studentdb";

app.use(cors())
app.use(express.json())

let students = [];

app.get("/students", async function (req, res) {

    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let students = await db.collection("students").find().toArray();
        await connection.close()
        res.json(students)
    } catch (error) {
        console.log(error)
    }
})

app.post("/student", async function (req, res) {

    try {
        // Connect to the DB Server
        let connection = await mongodb.connect(URL);

        // Select the particular DB
        let db = connection.db(DB)

        // Do CRUD operation
        await db.collection("students").insertOne(req.body)

        // Close the connection
        await connection.close()

        res.json({
            message: "Student Created"
        })
    } catch (error) {
        console.log(error)
    }
})

app.get("/student/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let student = await db.collection("students").findOne({ _id: mongodb.ObjectID(req.params.id) })
        await connection.close()
        res.json(student)
    } catch (error) {
        console.log(error)
    }
})

app.put("/student/:id",async function (req, res) {
    // let studentId = req.params.id;
    // let updateData = req.body;

    // // Find the index value of the student id 1
    // let studentindex = students.findIndex((obj) => obj.id == studentId)
    // let studentData = students[studentindex]
    // // console.log(studentindex)

    // if (studentData) {
    //     // Update the particular key
    //     Object.keys(updateData).forEach((keyItem) => {
    //         studentData[keyItem] = updateData[keyItem]
    //     })

    //     students[studentindex] = studentData;

    //     res.json({
    //         message: "studentUpdate Success"
    //     })
    // } else {
    //     res.json({
    //         message: "No User Found"
    //     })
    // }



    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("students").updateOne({_id:mongodb.ObjectID(req.params.id)},{$set : req.body})
        await connection.close()
        res.json({
            message : "User Updated"
        })
    } catch (error) {
        console.log(error)
    }
})

app.delete("/student/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("students").deleteOne({_id:mongodb.ObjectID(req.params.id)})
        await connection.close()
        res.json({
            message : "Deleted"
        })
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.PORT || 3000)
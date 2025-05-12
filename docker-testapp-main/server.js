const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Make sure your HTML is in a 'public' folder

// GET all users
app.get("/getUsers", async (req, res) => {
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        console.log("Connected to MongoDB for GET");
        const db = client.db("apnacollege-db");
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
    } finally {
        await client.close();
    }
});

// POST add user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        console.log("Connected to MongoDB for POST");
        const db = client.db("apnacollege-db");
        const result = await db.collection("users").insertOne(userObj);
        console.log("User inserted:", result.insertedId);
        res.send("User added successfully!");
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).send("Error adding user");
    } finally {
        await client.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { json } = require("body-parser");

const app = express();
const port = 4000;

const uri = "mongodb://127.0.0.1:27017";

function connect() {
    const client = new MongoClient(uri);
    return client;
}

app.use(cors());
app.use(express.json());


//for Agent Registration Page
app.post('/agentregistration', async (req, res) => {
    try {
        const { firstName, lastName, email, employee_Id, phone, bloodGroup, dob, password, address } = req.body

        if (!firstName || !lastName || !email || !employee_Id || !phone || !password) {
            res.status(200).json(`Enter to all feild!.`);
        } else {
            let agentInfo = { firstName, lastName, email, employee_Id, phone, bloodGroup, dob, password, address };
            const client = connect();
            await client.connect();
            const UniqID = `id_${Date.now()}`;
            agentInfo["id"] = UniqID;
            agentInfo["scoreCount"] = 0;
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            const result = await agentcollection.insertOne(agentInfo);
            await client.close();
            res.status(200).json("Agent Info Added");
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


// For Agent login page
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(200).json(`Enter email or password`);
        }
        else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            const result = await agentcollection.find({ email: email, password: password }).toArray();
            console.log(result[0].firstName); // for send a agent data without unwanted data
            res.status(200).json(result);
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For Agent info page if token use this. else use post and using eith email;
app.get('/getagentinfo', async (req, res) => {
    try {
        const client = connect();
        await client.connect();
        const db = client.db("Merchant_App");
        const agentcollection = db.collection("Agent_Info");
        const result = await agentcollection.find({}).toArray();
        res.status(200).json(result);
        await client.close();
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For edit Agent infomation
app.post('/editagentinfo', async (req, res) => {
    const { id } = req.body;
    const updates = {
        "bloodGroup": "O+ve",
        "scoreCount": "0"
    }
    try {
        if (!id) {
            res.status(200).json(`Invalid ID`);
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");

            const update = await agentcollection.updateOne(
                { id: id },
                { $set: updates }
            );

            // const update = await agentcollection.updateOne(
            //     { id : id},
            //     { $set : { bloodGroup : "O-ve", scoreCount : "2" }}
            // );

            const result = await agentcollection.find({ id: id }).toArray();
            res.status(200).json(result);
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For add store info
app.post('/addstoreinfo', async (req, res) => {
    try {
        const { storeName, ownerName, email, address, address2, city, postalcode, phone, GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode } = req.body;
        if (!storeName || !ownerName || !email || !address || !phone || !pancardNo || !aadharcardNo || !bankName || !accountNo || !IFSCCode) {
            res.status(200).json("Invalid Inputs.");
        } else {
            let storeInfo = { storeName, ownerName, email, address, address2, city, postalcode, phone, GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode };
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            const UniqID = `id_${Date.now()}`;
            storeInfo["id"] = UniqID;
            storeInfo["referal_id"] = ["id_1742404536258","id_1742504568227"];
            const result = await storecollection.insertOne(storeInfo);
            res.status(200).json("Successfully Added.");
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

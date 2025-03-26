const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const secretkey = 'abcde12345';

const app = express();
const port = 4000;

const uri = "mongodb://127.0.0.1:27017";

function connect() {
    const client = new MongoClient(uri);
    return client;
}

app.use(cors(
    // {
    //     origin: 'http://192.168.7.7:4000',  // Replace with your LAN IP
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //     allowedHeaders: ['Content-Type', 'Authorization']
    // }
));
app.use(express.json());

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.json({ data: "token required" });
    }
    try {
        const decoded = jwt.verify(token, secretkey);
        req.user = decoded;
        next();
    } catch (error) {
        res.json({ data: "Invalid Token" });
    }
};


app.get('/summa', (req, res) => {
    res, json('api is worked');
})

//for Agent Registration Page
app.post('/agentregistration', async (req, res) => {
    try {
        const { refname, relname, reemail, reemployee, rephone, bloodGroup, dob, address } = req.body
        console.log("hello")

        if (!refname || !relname || !reemail || !reemployee || !rephone) {
            res.status(200).json(`Enter to all feild!.`);
        } else {
            let agentInfo = { firstname: refname, lastname: relname, email: reemail, emplyoyeeID: reemployee, phone: rephone, bloodGroup: bloodGroup, dob: dob, address: address, gender };
            const client = connect();
            await client.connect();
            const UniqID = `id_${Date.now()}`;
            agentInfo["id"] = UniqID;
            agentInfo["scoreCount"] = 0;
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            if (reemail) {
                const mailverify = await agentcollection.find({ email: reemail }).toArray();
                if (mailverify == '' || mailverify == null) {
                    const result = await agentcollection.insertOne(agentInfo);
                    res.status(200).json("Agent Info Added");
                    await client.close();
                } else {
                    res.status(200).json('Email Already Exist');
                    await client.close();
                }
            }
        }
    } catch (error) {
        res.status(500).json(`EError is : ${error}`);
    }
});


// For Agent login page
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(200).json({ data: "Enter email or password" });
        }
        else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            const result = await agentcollection.find({ email: email, password: password }).toArray();
            if (result == '' || result == null) {
                res.status(200).json({ data: "Not matched" });
                await client.close();
            } else {
                const agent = result[0];

                const token = jwt.sign({
                    email: agent.email,
                    employee_Id: agent.emplyoyeeID,
                    id: agent.id,
                    phone: agent.phone
                }, secretkey, { expiresIn: "168h" });
                res.status(200).json({ data: "Successfully", token: token, agentname : result.firstname, agentemail : result.email });
                await client.close();
            }
            // console.log(result[0].firstName); // for send a agent data without unwanted data
            // res.status(200).json('Succesfully added');
            // await client.close();
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
            storedInfo["status"] = null;
            storeInfo["referal_id"] = ["id_1742404536258", "id_1742504568227"];
            const result = await storecollection.insertOne(storeInfo);
            res.status(200).json("Successfully Added.");
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For edit store info
app.post('/editstoreinfo', async (req, res) => {
    try {
        const { id } = req.body;
        let updatedetails = {
            "city": "Chennai",
            "storeType": "Hotel"
        }
        if (!id) {
            res.status(200).json("Invalid ID");
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            const editdetail = await storecollection.updateOne(
                { id: id },
                { $set: updatedetails }
            );
            const result = await storecollection.find({ id: id }).toArray();
            res.status(200).json("Successfully Edited");
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For agent created store and display => MyStore
app.get('/mystores', verifyToken, async (req, res) => {
    try {
        const targetId = req.user.id  //"id_1742404536258"; make sure change req.body and POST method.
        console.log(targetId);
        if (!targetId) {
            res.status(200).json("Invaid Input.");
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            const result = await storecollection.find({ referal_id: { $in: [targetId] } }).toArray();
            res.status(200).json(result)
            // console.log(result);
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


app.get('/allstores', async (req, res) => {
    try {
        const client = connect();
        await client.connect();
        const db = client.db("Merchant_App");
        const storecollection = db.collection("Store_Info");
        const result = await storecollection.find({}).toArray();
        res.status(200).json(result);
        await client.close();
    } catch (error) {
        ``
        res.status(500).json(`Error is : ${error}`);
    }
});


// For Incompleted store information 
app.post('/incompletestoreinfo', async (req, res) => {
    try {
        const { targetId } = req.body;
        if (!targetId) {
            res.status(200).json("Invaid Input.")
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            const agentstore = await storecollection.find({ referal_id: { $in: [targetId] } }).toArray();
            const incomplete = [];
            agentstore.map(doc => {
                console.log(doc.email);
                const nullfields = Object.keys(doc).filter(key => doc[key] === null);
                if (nullfields.length > 0) {
                    incomplete.push({ id: doc.id });
                }
            })
            res.status(200).json(incomplete);
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
    const targetId = req.body;
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

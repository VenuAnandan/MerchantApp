const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const secretkey = 'abcde12345';
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

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
                res.status(200).json({ data: "Successfully", token: token, agentname: agent.firstname, agentemail: agent.email });
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
app.get('/getagentinfo', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        res.status(200).json('invalid Id');
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            const result = await agentcollection.find({id:id}).toArray();
            if(result === 0){
                res.status(200).json('No agent data available');
            } else {
                const data = result[0];
                res.status(200).json({
                    fname:data.firstName,
                    lname:data.lastName,
                    email:data.email,
                    phone:data.phone,
                    address:data.address,
                    score:data.scoreCount,
                    gender:data.gender,
                    dob:data.dob,
                    bg:data.bloodGroup,
                });
            }
            await client.close();
        } catch (error) {
            res.status(500).json(`Error is : ${error}`);
        }
    }
});


//For edit Agent infomation
app.post('/editagentinfo',verifyToken, async (req, res) => {
    const id = req.user.id;
    const {fname,lname,email,phone,address,gender,dob,bg} = req.body;
    console.log(bg)
    const updates = {firstName:fname,lastName:lname,email:email,phone:phone,address:address,gender:gender,dob:dob,bloodGroup:bg}
    console.log(updates.bloodGroup);
    try {
        if (!id) {
            res.status(200).json(`Invalid ID`);
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");

            const value = await agentcollection.find({id:id}).toArray();

            if(value.length === 0 ){
                res.status(500).json('Invalid Agent');
            }else{
                const update = await agentcollection.updateOne(
                    { id: id },
                    { $set: updates }
                );
                res.status(200).json({
                    message : 'Successfully Added'
                })
            }

            // const result = await agentcollection.find({ id: id }).toArray();
            // console.log(result,'----------');
            // res.status(200).json(result);
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For add store info
app.post('/addstoreinfo', verifyToken, async (req, res) => {
    try {
        const { storeName, ownerName, email, address, address2, city, postalcode, phone, GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode } = req.body;

        const token = req.user.id

        let storeInfo = { storeName, ownerName, email, address, address2, city, postalcode, phone, GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode };
        const client = connect();
        await client.connect();
        const db = client.db("Merchant_App");
        const storecollection = db.collection("Store_Info");
        const UniqID = `id_${Date.now()}`;
        const now = new Date();

        const storedOr = await storecollection.find({ email: email }).toArray();
        console.log(storedOr, '-----------');
        if (storedOr.length === 0) {

            storeInfo["date"] = now.toISOString().split('T')[0];
            storeInfo["id"] = UniqID;
            storeInfo["status"] = '';
            storeInfo["referal_id"] = [token, "id_1742504568227"];
            storeInfo['pa'] = phone + '@bank';
            storeInfo['pn'] = storeName

            // qr
            const qrid = uuidv4();
            const qrData = {
                id: storeInfo.id,
                storeName: storeInfo.storeName,
                ownerName: storeInfo.ownerName,
                email: storeInfo.email,
                phone: storeInfo.phone,
                date: storeInfo.date,
                qrId: qrid
            };
            const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));
            storeInfo.qrCodeImage = qrCodeImage;
            storeInfo.qrId = qrid;
            // 


            const result = await storecollection.insertOne(storeInfo);
            const agentcollection = db.collection("Agent_Info");

            if (token) {
                const update = await agentcollection.updateOne(
                    { id: token },
                    { $inc: { scoreCount: 1 } }
                );
            }
            // res.status(200).json("Successfully Added.");
            res.status(200).json({
                message: "Store added successfully",
                storeId: storeInfo.id,
                qrCodeImage,
            });
        } else {

            const qrid = uuidv4();
            const qrData = {
                id: storeInfo.id,
                storeName: storeInfo.storeName,
                ownerName: storeInfo.ownerName,
                email: storeInfo.email,
                phone: storeInfo.phone,
                date: storeInfo.date,
                qrId: qrid
            };
            const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));
            storeInfo.qrCodeImage = qrCodeImage;
            storeInfo.qrId = qrid;
            // console.log(storeInfo);
            const editdetail = await storecollection.updateOne(
                { email: email },
                { $set: storeInfo }
            );

            res.status(200).json({
                message: "Store updated successfully",
                storeId: storeInfo.id,
                qrCodeImage,
            });

        }
        await client.close();
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


//For edit store info
app.post('/editstoreinfo', verifyToken, async (req, res) => {
    try {
        const { id } = req.body.id;
        const { storeName, ownerName, email, address, address2, city, postalcode, phone, GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode } = req.body;

        const token = req.user.id
        let updatedetails = { storeName, ownerName, email, address, address2, city, postalcode, phone, GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode };
        if (!id) {
            res.status(200).json("Invalid ID");
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            const now = new Date();
            updatedetails.date = now.toISOString().split('T')[0];


            const qrid = uuidv4();
            const qrData = {
                id: id,
                storeName: updatedetails.storeName,
                ownerName: updatedetails.ownerName,
                email: updatedetails.email,
                phone: updatedetails.phone,
                date: updatedetails.date,
                qrId: updatedetails.qrid
            };
            const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));
            updatedetails.qrCodeImage = qrCodeImage;
            updatedetails.qrId = qrid;
            console.log('---------');
            const editdetail = await storecollection.updateOne(
                { id: id },
                { $set: updatedetails }
            );

            res.status(200).json({
                message: "Store updated successfully"
            });
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


app.post('/getstoreinfo', verifyToken, async (req, res) => {
    try {
        const { id } = req.body.id;
        const token = req.user.id
        if (!id) {
            res.status(200).json("Invalid ID");
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");

            // console.log(storeInfo);
            const storedetail = await storecollection.find(
                { id: id }
            ).toArray();

            res.status(200).json({
                message: "Store getted successfully",
                storeinfo: storedetail
            });
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
app.get('/numberofincompletestoreinfo', verifyToken, async (req, res) => {
    try {
        const targetId = req.user.id  //"id_1742404536258"; make sure change req.body and POST method.
        // console.log(targetId);
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


app.get('/incompletestoreinfo', verifyToken, async (req, res) => {
    try {
        const targetId = req.user.id  //"id_1742404536258"; make sure change req.body and POST method.
        // console.log(targetId);
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
                // console.log(doc.email);
                const nullfields = Object.keys(doc).filter(key => doc[key] === null || doc[key] == '');
                if (nullfields.length > 0) {
                    incomplete.push(doc);
                    // console.log(incomplete);
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


app.post('/searchstore', async (req, res) => {
    const { storename } = req.body;
    try {
        if (!storename) {
            res.status(200).json(`Empty store name`);
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");

            // console.log(storename,"   storename");
            const result = await storecollection.find({
                storeName: { $regex: `^${storename}$`, $options: "i" }
            }).toArray();

            // console.log(result,"    result");
            if (result.length === 0) {
                res.status(200).json("Store not found");
            } else {
                res.status(200).json(result);
            }

            await client.close();
        }
    } catch (error) {
        console.log(`Error is : ${error}`);
    }
});


app.get('/getagentid', verifyToken, async (req, res) => {
    try {
        const id = req.user.id;
        if (id === null || id === '') {
            res.json('Id is empty...');
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            const result = await agentcollection.find({ id: id }).toArray();
            console.log(result);
            if (result.length === 0) {
                res.json("Match Not Found!");
            } else {
                res.status(200).json(result[0].scoreCount);
            }
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

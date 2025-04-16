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

app.use(cors());
app.use(express.json());


// app.get('/summa', (req, res) => {
//     res.json('api is worked');
// });


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



app.get('/forhome', verifyToken, async (req, res) => {
    const id = req.user.id;  // Get ID from query params
    if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const client = await connect();
        const db = client.db("Merchant_App");
        const agentCollection = db.collection("Agent_Info");

        const result = await agentCollection.findOne({ id: id });

        if (!result) {
            await client.close();
            return res.status(404).json({ message: 'No agent data available' });
        }

        const forhome = {
            fname: result.firstname,
            email: result.email,
            score: result.scoreCount
        };

        const storecollection = db.collection("Store_Info");
        const agentstore = await storecollection.find({ referal_id: { $in: [id] } }).toArray();
        const incomplete = [];
        agentstore.map(doc => {
            const nullfields = Object.keys(doc).filter(key => doc[key] === null || doc[key] == '');
            if (nullfields.length > 0) {
                incomplete.push(doc);
            }
        });

        const store = await storecollection.find({
            referal_id: id,
            Pending: { $in: ['Bank', 'Pan'] },
        }).toArray();

        const mystores = await storecollection.find({ referal_id: { $in: [id] } }).toArray();

        const ticketcollection = db.collection('Ticket_Rise');
        const numoftic = await ticketcollection.aggregate([
            { $match: { referal_id: { $in: [id] } } },
            { $count: "Count" }
        ]).toArray();


        forhome.incomple = incomplete.length;
        forhome.pending = store.length;
        forhome.sto = mystores.length;
        forhome.ticket = numoftic[0].Count;
        res.json(forhome);

        await client.close();
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: `Error occurred: ${error.message}` });
    }
});



//for Agent Registration Page
app.post('/agentregistration', async (req, res) => {
    try {
        const { refname, relname, reemail, reemployee, rephone, bloodGroup, dob, address, hashrepass } = req.body
        // console.log("hello");
        // console.log(hashrepass,"password");
        if (!refname || !relname || !reemail || !reemployee || !rephone || !hashrepass) {
            res.status(200).json(`Enter to all feild!.`);
        }
        else {
            let agentInfo = { firstname: refname, lastname: relname, email: reemail, emplyoyeeID: reemployee, phone: rephone, bloodGroup: bloodGroup, dob: dob, address: address, gender };
            const client = connect();
            await client.connect();
            const UniqID = `id_${Date.now()}`;
            agentInfo["id"] = UniqID;
            agentInfo["scoreCount"] = 0;
            agentInfo["inventory"] = [];
            agentInfo["accessories"] = [];
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
        res.json('hello');
        await client.close();
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
            const result = await agentcollection.findOne({ id: id }, { projection: { _id: 0, password: 0 } });
            // const fiterItems = await agentcollection.findOne({id:id},{projection:{'inventory.devicesid':1,accessories:1, _id:0}});

            if (result === 0) {
                res.status(200).json('No agent data available');
            } else {
                const data = result;
                res.status(200).json({
                    fname: data.firstname,
                    lname: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    score: data.scoreCount,
                    gender: data.gender,
                    dob: data.dob,
                    bg: data.bloodGroup,
                    id: data.id,
                    device: parseInt(data.inventory.length),
                    charge: parseInt(data.accessories.find(item => item.id == 'AC-CH1742536643458')?.quantity),
                    audio: parseInt(data.accessories.find(item => item.id == 'AC-ADC1742536643460')?.quantity),
                    battry: parseInt(data.accessories.find(item => item.id == 'AC-BTM1742536643461')?.quantity)

                    // charger : result.find(item => item.accessories.id == 'AC-CH1742536643458' )?.quantity,
                    // audio: result.find(item => item.accessories.id == 'AC-ADC1742536643460' )?.quantity,
                    // battry : result.find(item => item.accessories.id == 'AC-BTM1742536643461' )?.quantity,
                    // device: fiterItems.inventory.length,
                    // charge: fiterItems.
                });
                // console.log(data.accessories.find(item => item.id == 'AC-CH1742536643458' )?.quantity);
            }
            await client.close();
        } catch (error) {
            res.status(500).json(`Error is : ${error}`);
        }
    }
});


//For edit Agent infomation
app.post('/editagentinfo', verifyToken, async (req, res) => {
    const id = req.user.id;
    const { fname, lname, email, phone, address, gender, dob, bg } = req.body;
    console.log(bg)
    const updates = { firstName: fname, lastName: lname, email: email, phone: phone, address: address, gender: gender, dob: dob, bloodGroup: bg }
    console.log(updates.bloodGroup);
    try {
        if (!id) {
            res.status(200).json(`Invalid ID`);
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");

            const value = await agentcollection.find({ id: id }).toArray();

            if (value.length === 0) {
                res.status(500).json('Invalid Agent');
            } else {
                const update = await agentcollection.updateOne(
                    { id: id },
                    { $set: updates }
                );
                res.status(200).json({
                    message: 'Successfully Added'
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
        // console.log(storedOr, '-----------');
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


            if (!storeInfo.pancardNo || !storeInfo.aadharcardNo) {
                storeInfo.Pending = 'Pan'
            } else if (!storeInfo.accountNo) {
                storeInfo.Pending = 'Bank'
            } else {
                storeInfo.Pending = 'No'
            }

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


            if (!storeInfo.pancardNo || !storeInfo.aadharcardNo) {
                storeInfo.Pending = 'Pan'
            } else if (!storeInfo.accountNo) {
                storeInfo.Pending = 'Bank'
            } else {
                storeInfo.Pending = 'No'
            }


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


            if (!updatedetails.pancardNo || !updatedetails.aadharcardNo) {
                updatedetails.Pending = 'Pan'
            } else if (!updatedetails.accountNo) {
                updatedetails.Pending = 'Bank'
            } else {
                updatedetails.Pending = 'No'
            }

            // console.log('---------');
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
        // console.log(targetId);
        if (!targetId) {
            res.status(200).json("Invaid Input.");
        } else {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            // console.log(targetId);
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
    console.log('1');
    try {
        const client = connect();
        await client.connect();
        console.log('etho');
        const db = client.db("Merchant_App");
        const storecollection = db.collection("Store_Info");
        const result = await storecollection.find({}).toArray();
        console.log(result);
        res.status(200).json(result);
        await client.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(`Error is : ${error}`);
    }
});


// For Incompleted store information 
// app.get('/numberofincompletestoreinfo', verifyToken, async (req, res) => {
//     try {
//         const targetId = req.user.id  //"id_1742404536258"; make sure change req.body and POST method.
//         // console.log(targetId);
//         if (!targetId) {
//             res.status(200).json("Invaid Input.")
//         } else {
//             const client = connect();
//             await client.connect();
//             const db = client.db("Merchant_App");
//             const storecollection = db.collection("Store_Info");
//             const agentstore = await storecollection.find({ referal_id: { $in: [targetId] } }).toArray();
//             const incomplete = [];
//             agentstore.map(doc => {
//                 console.log(doc.email);
//                 const nullfields = Object.keys(doc).filter(key => doc[key] === null);
//                 if (nullfields.length > 0) {
//                     incomplete.push({ id: doc.id });
//                 }
//             });
//             res.status(200).json(incomplete);
//             await client.close();
//         }
//     } catch (error) {
//         res.status(500).json(`Error is : ${error}`);
//     }
//     const targetId = req.body;
// });


// app.get('/incompletestoreinfo', verifyToken, async (req, res) => {
//     try {
//         const targetId = req.user.id  //"id_1742404536258"; make sure change req.body and POST method.
//         // console.log(targetId);
//         if (!targetId) {
//             res.status(200).json("Invaid Input.")
//         } else {
//             const client = connect();
//             await client.connect();
//             const db = client.db("Merchant_App");
//             const storecollection = db.collection("Store_Info");
//             const agentstore = await storecollection.find({ referal_id: { $in: [targetId] } }).toArray();
//             const incomplete = [];
//             agentstore.map(doc => {
//                 // console.log(doc.email);
//                 const nullfields = Object.keys(doc).filter(key => doc[key] === null || doc[key] == '');
//                 if (nullfields.length > 0) {
//                     incomplete.push(doc);
//                     // console.log(incomplete);
//                 }
//             });
//             res.status(200).json(incomplete);
//             await client.close();
//         }
//     } catch (error) {
//         res.status(500).json(`Error is : ${error}`);
//     }
//     const targetId = req.body;
// });


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


            const result = await storecollection.find({
                storeName: { $regex: storename, $options: "i" }
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
            const result1 = await agentcollection.findOne({ id: id }, { projection: { _id: 0, scoreCount: 1 } });
            // console.log(result1.scoreCount);
            if (result1.length === 0) {
                res.json("Match Not Found!");
            } else {
                res.status(200).json(result1.scoreCount);
            }
            await client.close();
        }
    } catch (error) {
        res.status(500).json(`Error is : ${error}`);
    }
});


app.get('/pendingkyc', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const client = await connect();
        const db = client.db("Merchant_App");
        const storecollection = db.collection("Store_Info");


        const store = await storecollection.find({
            referal_id: id,
            Pending: { $in: ['Bank', 'Pan'] },
        }).toArray();


        res.json(store);

        await client.close();
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: `Error occurred: ${error.message}` });
    }
});


app.post('/risetoken', async (req, res) => {
    const { storeid, tokenMessage } = req.body;

    if (!storeid || !tokenMessage) {
        res.json('Data is Not Allowed');
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const storecollection = db.collection("Store_Info");
            const tiketcollection = db.collection("Ticket_Rise");
            const result = await storecollection.findOne({ id: storeid }, { projection: { storeName: 1, ownerName: 1, id: 1, phone: 1, _id: 0, referal_id: 1 } });
            // console.log(result);
            if (result == null || result == '' || result == []) {
                res.json('Invalid Store Information');
            } else {
                // console.log(result.referal_id[0]);
                result['message'] = tokenMessage;
                result['coversation'] = [];
                await tiketcollection.insertOne(result);
                res.status(200).json({
                    message: "Ticket Rise",
                    data: result
                });
            }
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/getticketrise', async (req, res) => {
    const id = 'id_1742404536258';  //use to token req.uer.id
    if (!id) {
        res.json('Invalid Emplyeee');
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const ticketcollection = db.collection('Ticket_Rise');
            const result = await ticketcollection.find({ referal_id: { $in: [id] } }).toArray();
            // console.log(result);
            if (result == null || result == '' || result == []) {
                res.json('Invalid Store Information');
            } else {
                res.json({
                    message: "Ticket Rise Stores",
                    data: result
                });
            }

            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


// This is for StoreKeeper...
app.post('/chattoagent', async (req, res) => {
    const id = "id_1742455199568";   //use token for store id in the future
    const { message } = req.body
    if (!id || !message) {
        res.json({
            message: 'The Store is Invalid!'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const ticketcollection = db.collection('Ticket_Rise');

            const data = {
                from: 'store',
                date: new Date(),
                message: message,
            }

            const result = await ticketcollection.updateOne(
                { id: id },
                { $push: { coversation: data } }
            );

            if (result.modifiedCount > 0) {
                res.json('Message Sended Successfully');
            } else {
                res.json('Message is Not Sended or Id Not Matched!');
            }

            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


// This is for Agent....
app.post('/chattostorekeeper', verifyToken, async (req, res) => {
    const id = req.user.id;   //use token for store id in the future
    const { message } = req.body
    if (!id || !message) {
        res.json({
            message: 'The Store is Invalid!'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const ticketcollection = db.collection('Ticket_Rise');

            // console.log(message);

            const data = {
                from: 'agent',
                date: new Date(),
                message: message,
            }

            const result = await ticketcollection.updateOne(
                { referal_id: { $in: [id] } },
                { $push: { coversation: data } }
            );

            if (result.modifiedCount > 0) {
                res.json('Message Sended Successfully');
            } else {
                res.json('Message is Not Sended or Id Not Matched!');
            }

            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/chats', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        res.json({
            message: 'Agent Id is Missing'
        });
    } else {
        // console.log(id);
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const ticketcollection = db.collection('Ticket_Rise');


            const result = await ticketcollection.findOne(
                { referal_id: { $in: [id] } },
                { projection: { coversation: 1, _id: 0, storeName: 1 } }
            );

            if (result == '' || result == null || result == undefined) {
                res.json({
                    message: 'Empty Messages'
                });
            } else {
                res.json({
                    message: 'Chats founded',
                    data: result,
                    storeName: result.storeName
                });
            }

            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/allAgentId', async (req, res) => {
    const client = connect();
    await client.connect();
    const db = client.db("Merchant_App");
    const agentIdcollection = db.collection('Agent_Info');
    const result = await agentIdcollection.find(
        {},
        { projection: { id: 1, firstname: 1, _id: 0 } }
    ).toArray();
    // console.log(result);
    res.json(result);
    await client.close();
});


app.post('/storedevice', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        res.json({
            message: 'Employee Id is Missing'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const devicescollection = db.collection('Devices');
            const agentcollection = db.collection("Agent_Info");
            const { device } = req.body;
            if (!device || device == '') {
                res.json({
                    message: 'Empty devices'
                })
            } else {
                await Promise.all(device.map(async (item) => {
                    const itemid = item.deviceid;

                    const check = await agentcollection.findOne({ inventory: { $in: [itemid] } }, { projection: { _id: 0, id: 1 } });
                    if (!check) {
                        await agentcollection.updateOne(
                            { id: { $in: [id] } },
                            { $push: { inventory: itemid } }
                        );
                        await devicescollection.insertOne(item);
                        // console.log('Device pushed');
                    }

                    const deviceparcel = await devicescollection.findOne({ deviceid: itemid }, { projection: { _id: 0, id: 1 } });

                    if (!deviceparcel) {
                        await parcelcollection.insertOne(item);
                    }

                }));
                res.json({
                    message: 'Device added successfully'
                });
            }
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/getmydevices', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        res.json({
            message: 'Employee id is empty'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection('Agent_Info');
            const devices = await agentcollection.findOne({ id: id }, { projection: { inventory: 1, _id: 0 } });
            if (devices) {
                res.json({
                    message: 'Devices are finded',
                    data: devices.inventory
                });
            } else {
                res.json({
                    message: 'Devices not founded',
                    data: []
                });
            }
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.post('/storeparcels', verifyToken, async (req, res) => {

    const id = req.user.id;

    const { data } = req.body;
    if (!data) {
        res.json({
            message: 'Empty Data'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const parcelcollection = db.collection('Parcels');
            const agentcollection = db.collection("Agent_Info");

            if (!data || data == '') {
                res.json({
                    message: 'Empty devices'
                });
            } else {
                await Promise.all(data.map(async (item) => {
                    const items = item.devices;

                    // console.log(items[0]);


                    await Promise.all(items.map(async (initem) => {
                        // console.log(initem,"inside items");
                        const check = await agentcollection.findOne({ inventory: { $in: [initem] } }, { projection: { _id: 0, id: 1 } });
                        // const checkparcels = await parcelcollection.findOne();
                        // console.log(item);
                        // await parcelcollection.insertOne(item);
                        // console.log(check);
                        if (!check) {
                            await agentcollection.updateOne(
                                { id: { $in: [id] } },
                                { $push: { inventory: initem } }
                            );
                            // console.log(check);
                            await parcelcollection.insertOne(item);
                            console.log('Device pushed');
                        }

                        const checkparcel = await parcelcollection.findOne({ devices: { $in: [initem] } }, { projection: { _id: 0, id: 1 } });

                        if (!checkparcel) {
                            await parcelcollection.insertOne(item);
                        }

                    }));
                }));


                res.json({
                    message: 'Device added successfully'
                });
            }


            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/getmyparcels', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        res.json({
            message: 'Employee id is empty'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const parcelscollection = db.collection('Parcels');
            const result = await parcelscollection.find({ agentid: id }, { projection: { reciver: 1, sender: 1, _id: 0, parcelNumber: 1 } }).toArray();
            if (result) {
                res.json({
                    message: 'Devices are finded',
                    data: result
                });
            } else {
                res.json({
                    message: 'Devices not founded',
                    data: []
                });
            }
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.post('/addagentstoredevice', verifyToken, async (req, res) => {
    const { deviceids } = req.body;
    const id = req.user.id;
    if (deviceids || id) {
        try {

            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");

            const checkagent = await agentcollection.findOne({ id: id }, { projection: { inventory: 1, _id: 0 } });
            const agentinventory = checkagent.inventory;


            await Promise.all(deviceids.map(async (deviceid) => {
                // console.log(agentinventory);

                const devicetrue = agentinventory.some((detail) => detail.devicesid == deviceid);
                if (!devicetrue) {
                    await agentcollection.updateOne(
                        { id: { $in: [id] } },
                        { $push: { inventory: { devicesid: deviceid, status: 'active' } } }
                    );
                }
            }));

            res.json({
                message: 'Added Successfully'
            });
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    } else {
        res.json({
            message: 'Employee id is empty'
        });
    }
});



app.post('/addagentstoreaccess', verifyToken, async (req, res) => {
    const { access } = req.body;
    const id = req.user.id;
    // console.log(id);
    if (access || id) {
        try {

            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");

            const checkagent = await agentcollection.findOne({ id: id }, { projection: { accessories: 1, _id: 0 } });
            const agentaccess = checkagent.accessories;


            await Promise.all(access.map(async (accesss) => {
                const accesstrue = agentaccess.find(item => item.id === accesss.id);
                if (accesstrue) {
                    await agentcollection.updateOne(
                        { id: id, 'accessories.id': accesss.id },
                        { $inc: { 'accessories.$.quantity': parseInt(accesss.quantity) } }
                        // { $push: { accessories: { id: accesss.id, quantity: accesss.quantity }  } }
                    );
                } else {
                    console.log(accesss.id);
                    await agentcollection.updateOne(
                        { id: id },
                        // {$inc:{'accessories.$.quantity':accesss.quantity}}
                        { $push: { accessories: { id: accesss.id, quantity: parseInt(accesss.quantity) } } }
                    );
                }
            }));

            res.json({
                message: 'Added Successfully'
            });

            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    } else {
        res.json({
            message: 'Employee id is empty'
        });
    }
});


app.post('/devilveragentdevice', verifyToken, async (req, res) => {
    const id = req.user.id;
    const { deviceid } = req.body;
    // console.log(deviceid);
    if (id || deviceid) {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");

            const checkagent = await agentcollection.findOne({ id: id }, { projection: { inventory: 1, _id: 0 } });
            const agentinventory = checkagent.inventory;

            const devicetrue = agentinventory.some((detail) => detail.devicesid == deviceid);
            // console.log(devicetrue);
            if (devicetrue) {
                await agentcollection.updateOne(
                    { id: { $in: [id] }, 'inventory.devicesid': deviceid },
                    { $set: { 'inventory.$.status': "delivered", } }
                );
            }

            res.json({
                message: 'Deliverd'
            });

            await client.close();
        } catch (error) {

        }
    }
});


app.post('/verifydeviceid', verifyToken, async (req, res) => {
    const { deviceid } = req.body;
    const id = req.user.id;
    if (!deviceid || !id) {
        res.json({
            message: 'Device or id missing'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection("Agent_Info");
            const result = await agentcollection.findOne({ id: id, "inventory.devicesid": deviceid }, { projection: { id: 1, _id: 0 } });

            res.json({
                message: result ? 'Yes' : 'No',
            });
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }

    }
});


app.post('/packdamage', verifyToken, async (req, res) => {
    const { deviceid, charge, battery, audiocable, messgaes, suppid, suppname, pickloc, desloc } = req.body;
    const id = req.user.id;
    // console.log(id);
    if (!deviceid || !charge || !battery || !audiocable || !suppid || !suppname || !pickloc || !desloc) {
        res.json({
            message: 'Data Missing'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const damagecollection = db.collection("Damages");
            const agentcollection = db.collection("Agent_Info");
            // console.log(id);
            const data = { deviceid, charge, battery, audiocable, messgaes, suppid, suppname, pickloc, desloc }

            // console.log(data);
            const generateParcelNumber = () => {
                const timestamp = Date.now().toString().slice(-6);
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                return `PCL${timestamp}${randomSuffix}`;
            };

            data["parcel_id"] = generateParcelNumber();
            data["status"] = "pending";
            data["agent_id"] = id;
            // if the model is differe to other we wil modify it easily
            data["batteryinfo"] = { id: 'AC-BTM1742536643461', quantity: battery, status: 'damaged' }
            data['audioinfo'] = { id: 'AC-ADC1742536643460', quantity: audiocable, status: 'damaged' }
            data['chargerinfo'] = { id: 'AC-CH1742536643458', quantity: charge, status: 'damaged' }
            data['accessories'] = [
                { id: 'AC-BTM1742536643461', quantity: battery, status: 'damaged' },
                { id: 'AC-ADC1742536643460', quantity: audiocable, status: 'damaged' },
                { id: 'AC-CH1742536643458', quantity: charge, status: 'damaged' }
            ]

            // console.log(data);

            const agentinfo = await agentcollection.findOne({ id: id }, { projection: { accessories: 1, _id: 0 } });

            const chargeavailable = agentinfo.accessories.some(item => item.id == "AC-CH1742536643458" && item.quantity >= charge);
            const audioavailable = agentinfo.accessories.some(item => item.id == "AC-ADC1742536643460" && item.quantity >= audiocable);
            const batteryavailable = agentinfo.accessories.some(item => item.id == "AC-BTM1742536643461" && item.quantity >= battery);

            // console.log(chargeavailable, audioavailable, batteryavailable);

            if (chargeavailable && audioavailable && batteryavailable) {
                
                await damagecollection.insertOne(data);

                await Promise.all(deviceid.map(async (item) => {
                    await agentcollection.updateOne(
                        { 'inventory.devicesid': item },
                        {
                            $set: { 'inventory.$[elem].status': 'damaged' }
                        },
                        {
                            arrayFilters: [{ 'elem.devicesid': item }]
                        }
                    );
                }));


                res.json({
                    message: 'Added Data'
                });
            } else {
                res.json({
                    message: 'Data is Missing or Quantity is High'
                });
            }

            await client.close();

        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/getpdamageparcels', verifyToken, async (req, res) => {
    const id = req.user.id;
    if (!id) {
        res.json({
            message: 'Employee id is empty'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const damagecollection = db.collection('Damages');
            const damage = await damagecollection.find({}).toArray();
            if (damage) {
                res.json({
                    message: 'Devices are finded',
                    data: damage
                });
            } else {
                res.json({
                    message: 'Devices not founded',
                    data: []
                });
            }
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.post('/getparcelinfo', verifyToken, async (req, res) => {
    const { parcel_id } = req.body;
    const id = req.user.id;
    if (!parcel_id || !id) {
        res.json({
            message: 'Device or id missing'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const damagecollection = db.collection("Damages");
            const result = await damagecollection.findOne({ parcel_id: parcel_id }, { projection: { _id: 0 } });
            // console.log(result);

            res.json({
                message: result ? 'Yes' : 'No',
                data: result
            });
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }

    }
});


app.post('/updatepackdamage', verifyToken, async (req, res) => {
    const { deviceid, charge, battery, audiocable, messgaes, suppid, suppname, pickloc, desloc, parcel_id } = req.body;
    const id = req.user.id;
    if (!deviceid || !charge || !battery || !audiocable || !suppid || !suppname || !pickloc || !desloc || !parcel_id) {
        res.json({
            message: 'Data Missing'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const damagecollection = db.collection("Damages");
            const agentcollection = db.collection('Agent_Info');
            const data = { deviceid, charge, battery, audiocable, messgaes, suppid, suppname, pickloc, desloc, parcel_id }

            const findparcel = await damagecollection.findOne({ parcel_id: parcel_id }, { projection: { status: 1, _id: 0 } });
            // console.log(findparcel);
            if (findparcel == '' || findparcel == null) {
                res.json({
                    messgaes: 'No find Parcel',
                });
            } else {

                const agentinfo = await agentcollection.findOne({ id: id }, { projection: { accessories: 1, _id: 0 } });

                const chargeavailable = agentinfo.accessories.some(item => item.id == "AC-CH1742536643458" && item.quantity >= charge);
                const audioavailable = agentinfo.accessories.some(item => item.id == "AC-ADC1742536643460" && item.quantity >= audiocable);
                const batteryavailable = agentinfo.accessories.some(item => item.id == "AC-BTM1742536643461" && item.quantity >= battery);

                // console.log(chargeavailable, audioavailable, batteryavailable);

                if (chargeavailable && audioavailable && batteryavailable) {

                    await damagecollection.updateOne({ parcel_id: parcel_id, agent_id: id }, { $set: { 'batteryinfo.quantity': battery } });
                    await damagecollection.updateOne({ parcel_id: parcel_id, agent_id: id }, { $set: { 'audioinfo.quantity': audiocable } });
                    await damagecollection.updateOne({ parcel_id: parcel_id, agent_id: id }, { $set: { 'chargerinfo.quantity': charge } });
                    // console.log(data);


                    //------------------------------------------------------------
                    await damagecollection.updateOne({ parcel_id: parcel_id, agent_id: id }, { $set: data });

                    await agentcollection.updateOne(
                        { id },
                        { $set: { 'inventory.$[match].status': 'damaged' } },
                        { arrayFilters: [{ 'match.devicesid': { $in: deviceid } }] }
                    );

                    await agentcollection.updateOne(
                        { id },
                        { $set: { 'inventory.$[others].status': 'active' } },
                        { arrayFilters: [{ 'others.devicesid': { $nin: deviceid } }] }
                    );
                    //------------------------------------------------------------

                    res.json({
                        messgaes: 'Parcel Updated',
                    });

                } else {
                    res.json({
                        messgaes: 'Parcel Not Updated, Quantity is heigh',
                    });
                }

            }
            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


app.get('/agentdeviceinfo', async (req, res) => {
    try {
        const client = connect();
        await client.connect();
        const db = client.db("Merchant_App");
        const agentcollection = db.collection('Agent_Info');
        const agents = await agentcollection.find({}, { projection: { id: 1, _id: 0, firstname: 1, emplyoyeeID: 1, phone: 1, inventory: 1, accessories: 1 } }).toArray();

        const result = agents.map(agent => {
            const id = agent.id;
            const firstname = agent.firstname;
            const lastname = agent.lastname;
            const emplyoyeeID = agent.emplyoyeeID;
            const phone = agent.phone;
            const deviceCount = Array.isArray(agent.inventory)
                ? agent.inventory.filter(device => device.status == 'active').length : 0;

            const agentaccessories = Array.isArray(agent.accessories)
                ? agent.accessories.map(acc => ({
                    device_id: acc.id || null,
                    quantity: acc.quantity || 0
                })) : [{ device_id: null, quantity: 0 }];

            return {
                id: id,
                firstname: firstname,
                lastname: lastname,
                emplyoyeeID: emplyoyeeID,
                phone: phone,
                deviceCount: deviceCount,
                accessories: agentaccessories
            };
        });


        res.json({
            message: 'Agent Inventories',
            data: result
        });

        await client.close();
    } catch (error) {
        res.status(500).json({ message: `Error occurred: ${error.message}` });
    }
});


// remove devices
app.post('/removedevices', async (req, res) => {
    const id = req.body.agent_id;
    const { deviceid, accessories } = req.body
    if (!id) {
        res.json({
            message: 'Agent Id is missing'
        });
    } else {
        try {
            const client = connect();
            await client.connect();
            const db = client.db("Merchant_App");
            const agentcollection = db.collection('Agent_Info');
            const agentdetail = await agentcollection.findOne({ id: id }, { projection: { inventory: 1, accessories: 1, _id: 0 } });

            await Promise.all(deviceid.map(async (dev) => {
                await Promise.all(agentdetail.inventory.map(async (device) => {
                    if (device.devicesid == dev.devicedata) {
                        const removedevices = await agentcollection.updateOne({ id: id }, { $pull: { inventory: { devicesid: dev.devicedata } } });
                        if (removedevices.modifiedCount > 0) {
                            console.log("removed")
                        }
                    }
                }));
            }));


            await Promise.all(accessories.map(async (dev) => {
                await Promise.all(agentdetail.accessories.map(async (device) => {
                    if (device.id == dev.id) {
                        const removedevices = await agentcollection.updateOne({ id: id, "accessories.id": dev.id }, { $inc: { 'accessories.$.quantity': -dev.quantity } });
                        if (removedevices.modifiedCount > 0) {
                            console.log("removed");
                        }
                    }
                }));
            }));


            res.json({
                data: deviceid,
                message: "requested data"
            });

            await client.close();
        } catch (error) {
            res.status(500).json({ message: `Error occurred: ${error.message}` });
        }
    }
});


//request for device 
// app.post('/itemsrequest',verifyToken, async (req, res) => {
//     const id = req.user.id;
//     const {data} = req.body
//     if (!id || !data ) {
//         res.json({
//             message: 'ID or Data is missing'
//         });
//     } else {
//         try {
//             const client = connect();
//             await client.connect();
//             const db = client.db("Merchant_App");
//             const damagecollection = db.collection("Damages");
//             const agentcollection = db.collection('Agent_Info');

//             const fiterItems = await agentcollection.findOne({id:id},{projection:{'inventory.devicesid':1,accessories:1, _id:0}});

//             // console.log(requestItem)

//             res.json({
//                 message:'Data',
//                 data:requestItem
//             });

//             await client.close();

//         } catch (error) {
//             res.status(500).json({
//                 message:error
//             });
//         }

//     }
// });


// app.post('/gettrue', async (req, res) => {
//     const { quantity } = req.body
//     const client = connect();
//     await client.connect();
//     const db = client.db("Merchant_App");
//     // const damagecollection = db.collection("Damages");
//     const agentcollection = db.collection('Agent_Info');
// const agentinfo = await agentcollection.findOne({ id: "id_1742404536258" }, { projection: { accessories: 1, _id: 0 } });

// const chargeavailable = agentinfo.accessories.some(item => item.id == "AC-CH1742536643458" && item.quantity >= quantity );


//     await client.close()

// });



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

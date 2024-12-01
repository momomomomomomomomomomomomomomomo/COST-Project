const express = require('express');
require('dotenv').config();
const path = require('path');
const axios = require('axios');
const mqtt = require('mqtt');
const mysql = require('mysql');
const hash = require('crypto');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(express.json()); 

//define https traffic ca cert to reference
const options = {
    cert: fs.readFileSync('/home/ubuntu/https/server.crt'),
    key: fs.readFileSync('/home/ubuntu/https/server.key'),
};

// Establish DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,   
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    connectTimeout: 10000,
    ssl: {
    ca: fs.readFileSync('/home/ubuntu/certs/rds-ca-bundle.pem') 
        
    }
});


db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});


// DB endpoints (API calls)
app.get('/get/pricing', (req, res) => {
    const query = 'SELECT * FROM Pricing';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.get('/get/order', (req, res) => {
    const query = 'SELECT * FROM Orders';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});


app.post('/get/customerorder', (req, res) => {
    const Name = req.body.user;
    const query = 'SELECT * FROM Orders WHERE UserID = (SELECT UserID FROM User WHERE Name = ?)';
    
    db.query(query,[Name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.post('/get/account', (req, res) => {
    const Name = req.body.user;
    const query = 'SELECT * FROM User WHERE Name = ? LIMIT 1';
    
    db.query(query,[Name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.post('/add/pricing', (req, res) => {
    const Location = req.body.Location; 
    const PricePerkWH = req.body.PricePerkWH; 
    const TotalAmountEarned = req.body.TotalAmountEarned;
    const TotalElectricityExpended = req.body.TotalElectricityExpended;
    const query = 'INSERT INTO Pricing(Location, PricePerkWH, TotalAmountEarned, TotalElectricityExpended) VALUES (?, ?, ?, ?)';
    db.query(query,[Location,PricePerkWH,TotalAmountEarned,TotalElectricityExpended], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.put('/update/pricing', (req, res) => {
    const Location = req.body.Location; 
    const PricePerkWH = req.body.PricePerkWH; 
    const CurrentLocation = req.body.CurrentLocation
    const query = 'UPDATE Pricing SET Location = ?, PricePerkWH = ? WHERE Location = ?';
    db.query(query,[Location,PricePerkWH,CurrentLocation], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.put('/update/password', (req, res) => {
    const Name = req.body.Name; 
    const Password = req.body.newPassword;
    const HashedPassword = hash.createHash('sha1').update(Password).digest('hex');
    const query = 'UPDATE User SET Password = ? WHERE Name = ?';
    db.query(query,[HashedPassword,Name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.put('/update/details', (req, res) => {
    const Name = req.body.Name;
    const UpdatedName = req.body.UpdatedName;
    const Birthdate = req.body.Birthdate
    const Sex = req.body.Sex;
    const VehiclePlateNumber = req.body.VehiclePlateNumber;
    const VehicleModel = req.body.VehicleModel;
    
    const query = 'UPDATE User SET Name = ?, Birthdate = ?, Sex = ?, VehiclePlateNumber = ?, VehicleModel = ? WHERE NAME = ?';
    db.query(query,[UpdatedName,Birthdate,Sex,VehiclePlateNumber,VehicleModel,Name], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results);
    });
});

app.delete('/delete/pricing', (req, res) => {
    const Location = req.body.Location; 
    const query = 'DELETE FROM Pricing WHERE Location = ?';
    db.query(query,[Location], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.post('/add/user', (req, res) => {
    const Name = req.body.Name; 
    const Password = req.body.Password
    const HashedPassword = hash.createHash('sha1').update(Password).digest('hex');
    const Birthdate = req.body.Birthdate; 
    const Sex = req.body.Sex;
    const VehiclePlateNumber = req.body.VehiclePlateNumber
    const VehicleModel = req.body.VehicleModel
    const ProfileType = "Customer"
    
    const query = 'INSERT INTO User(Name, Password, Birthdate, Sex, VehiclePlateNumber, VehicleModel, ProfileType) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query,[Name,HashedPassword,Birthdate,Sex,VehiclePlateNumber,VehicleModel,ProfileType], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results);
        
    });
});

app.post('/login/user', (req, res) => {
    const Name = req.body.Name; 
    const Password = req.body.Password
    const HashedPassword = hash.createHash('sha1').update(Password).digest('hex');
    const query = 'SELECT * FROM User WHERE Name=? AND Password=? LIMIT 1';
    db.query(query,[Name,HashedPassword], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results);
    });
});

app.post('/request-data', async (req, res) => {
    try {
        let topic = req.body.topic;
        
        const topics = {
            Electric: 'http://35.170.44.112:80/publish',
            RFID: 'http://35.170.44.112:81/publish',
            Location: 'http://35.170.44.112:82/publish',
        };
        const publisherIP = topics[topic];
        if (!publisherIP) {
            return res.status(400).json({ status: 'error', message: "Invalid topic" });
        }
        
        const randomNumber = Math.floor(Math.random() * 100000)
        topic = `${randomNumber}/${topic}`;
        //console.log(topic);
        const user = req.body.user

        //connect and sub
        //console.log(`Publisher IP: ${publisherIP}`);
        const mqttbroker = "mqtt://52.71.236.160:1883";
        const mqttClient = mqtt.connect(mqttbroker);

        await new Promise((resolve, reject) => {
            mqttClient.on('connect', () => {
                //console.log('Connected to MQTT broker');
                mqttClient.subscribe(topic, (err) => {
                    if (err) {
                        reject('Failed to subscribe to topic');
                    } else {
                        //console.log(`Subscribed to topic: ${topic}`);
                        resolve();
                    }
                });
            });
            mqttClient.on('error', (err) => {
                reject(`MQTT connection error: ${err}`);
            });
        });
        
        //semd request to sensor
        console.log(`Sending data to publisher IP: ${publisherIP} with topic: ${topic}`);
        const response = await axios.post(publisherIP, {"topic": topic,"user": user});
        
        //receive and parse received data
        const message = await new Promise((resolve, reject) => {
            mqttClient.on('message', (receivedTopic, message) => {
                console.log(`Received message on topic ${topic}: ${message.toString()}`);
                resolve(message.toString());
            });
            mqttClient.on('error', (err) => {
                reject(`MQTT error: ${err}`);
            });
        });
        mqttClient.end(true, () => {
            console.log('MQTT client disconnected');
        });
        
        //console.log(message);
        //console.log('reached end');
        
        //reponse data
        res.json({
            "statusMsg": 'success',
            "sensorData": message
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/add/order', (req, res) => {
    const Name = req.body.Name;
    const Location = req.body.Location;
    const ElectricityUsedkW = req.body.ElectricityUsedkW;
    const ChargingStart = req.body.ChargingStart;
    const ChargingEnd = req.body.ChargingEnd;
    const PaymentStatus = req.body.PaymentStatus;
    const OrderPrice = req.body.OrderPrice;
    const query = 'INSERT INTO Orders (UserID, PricingID, ElectricityUsedkW, ChargingStart, ChargingEnd, PaymentStatus, OrderPrice) VALUES ((SELECT UserID FROM User WHERE Name = ? LIMIT 1), (SELECT PricingID FROM Pricing WHERE Location = ? LIMIT 1), ?,?,?,?,?)';
    db.query(query,[Name,Location,ElectricityUsedkW,ChargingStart,ChargingEnd,PaymentStatus,OrderPrice], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.post('/add/card', (req, res) => {
    const Name = req.body.Name;
    const CardOwner = req.body.CardOwner;
    const CardPan = req.body.CardPan;
    const ServiceCode = req.body.ServiceCode;
    const ExpiryDate = req.body.ExpiryDate;
    const query = 'INSERT INTO CreditInfo (UserID, CardOwner, CardPAN, ServiceCode, ExpiryDate) VALUES ((SELECT UserID FROM User WHERE Name = ? LIMIT 1),?, ?, ?, ?)';
    db.query(query,[Name,CardOwner,CardPan,ServiceCode,ExpiryDate], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.post('/get/locationPricing', (req, res) => {
    const Location = req.body.Location;
    const query = 'SELECT PricePerkWH FROM Pricing WHERE Location = ?';
    db.query(query,[Location], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.put('/update/totalAmountandElec', (req, res) => {
    const AddedAmount = req.body.OrderPrice;
    const AddedkW = req.body.kW;
    const Location = req.body.Location;
    const query = 'UPDATE Pricing SET TotalAmountEarned = TotalAmountEarned + ?,TotalElectricityExpended = TotalElectricityExpended + ?  WHERE Location =?';
    db.query(query,[AddedAmount,AddedkW,Location], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results); 
    });
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 443;
https.createServer(options,app).listen(port, () => {
    console.log(`Server is running on https://44.194.232.244:${port}`);
});
// app.listen(port, () => {
//     console.log(`Server is running on https://44.194.232.244:${port}`);
// });

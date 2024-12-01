const express = require('express');
const mqtt = require('mqtt');
const app = express();
const port = 81;

app.use(express.json());

app.post('/publish', (req, res) => {
    const MQTT_TOPIC = req.body.topic;
    const user = req.body.user;
    const MQTT_BROKER = 'mqtt://52.71.236.160:1883';

    const mqttClient = mqtt.connect(MQTT_BROKER);

    mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');

        const serviceCodes = [
        '244',
        '890',
        '687',
        '530',
        '146'
        ];

        const panCodes = [
        '1327432187142378',
        '9525792052795230',
        '0987132474132075',
        '7379431974109714',
        '5367556519307517'
        ];

        const expiryDates = [
        '2028-04-06',
        '2025-11-09',
        '2026-08-30',
        '2027-10-27',
        '2026-04-12'
        ]

        const serviceCode = serviceCodes[Math.floor(Math.random() * serviceCodes.length)];
        const panCode = panCodes[Math.floor(Math.random() * panCodes.length)];
        const expiryDate = expiryDates[Math.floor(Math.random() * expiryDates.length)];

        const data = { 
        "cardOwner" : user,
        "serviceCode" : serviceCode,
        "panCode" : panCode,
        "expiryDate" : expiryDate 
         };

        mqttClient.publish(MQTT_TOPIC, JSON.stringify(data), (err) => {
            if (err) {
                console.log('Error publishing data:', err);
                return res.status(500).json({ error: 'Failed to publish data' });
            }

            console.log(`Data published to topic ${MQTT_TOPIC}:`, data);
            res.status(200).json({ message: 'Data published successfully', data });
            //mqttClient.end(true, () => {
                //console.log('MQTT client disconnected');
            //});
        });
    });

    mqttClient.on('error', (err) => {
        console.log('MQTT connection error:', err);
        res.status(500).json({ error: 'Failed to connect to MQTT broker' });
    });
});

app.listen(port,'0.0.0.0', () => {
    console.log(`RFID Sensor Server running on http://35.170.44.112:${port}`);
});

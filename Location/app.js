const express = require('express');
const mqtt = require('mqtt');
const app = express();
const port = 82;

app.use(express.json());

app.post('/publish', (req, res) => {
    const MQTT_TOPIC = req.body.topic;
    const MQTT_BROKER = 'mqtt://52.71.236.160:1883';

    const mqttClient = mqtt.connect(MQTT_BROKER);
    
    mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');

        const Locations = [
        "Temasek Polytechnic",
        "Ngee Ann Polytechnic",
        "Republic Polytechnic",
        "Nanyang Polytechnic",
        "Singapore Polytechnic"
        ];

        const randomIndex = Math.floor(Math.random() * Locations.length);
        const Location = Locations[randomIndex];
        const data = { 
        "pricedLocation" : Location
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
    console.log(`Location Sensor Server running on http://35.170.44.112:${port}`);
});

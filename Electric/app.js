const express = require('express');
const mqtt = require('mqtt');
const app = express();
const port = 80;

app.use(express.json());

app.post('/publish', (req, res) => {
    const MQTT_TOPIC = req.body.topic;
    const MQTT_BROKER = 'mqtt://52.71.236.160:1883';

    const mqttClient = mqtt.connect(MQTT_BROKER);
    
    mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        
        const kW = (Math.random() * 5).toFixed(2);

        const startTimes = [
        "2024-07-03 15:29:26",
        "2023-12-09 05:49:57",
        "2024-09-07 07:34:17",
        "2023-12-19 18:00:19",
        "2024-04-19 15:16:58"
        ];

        const endTimes = [
        "2024-07-03 17:45:26",
        "2023-12-09 10:16:57",
        "2024-09-07 11:14:17",
        "2023-12-19 20:24:19",
        "2024-04-19 17:13:58"
        ];

        const randomIndex = Math.floor(Math.random() * startTimes.length);
        const startTime = startTimes[randomIndex];
        const endTime = endTimes[randomIndex];
        const data = { 
        "kW" : parseFloat(kW),
        "chargingStart" : startTime,
        "chargingEnd" : endTime
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
    console.log(`Electric Sensor Server running on http://35.170.44.112:${port}`);
});

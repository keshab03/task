const io = require('socket.io');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;

const server = io.listen(3000); // Replace with your desired port
const mongoURI = 'mongodb://localhost:27017/yourdb'; // Replace with your MongoDB URI
const dataCollectionName = 'timeseriesData';

server.on('connection', (socket) => {
    socket.on('dataStream', (dataStream) => {
        const messages = dataStream.split('|');
        const validatedMessages = [];

        messages.forEach((message) => {
            try {
                const decryptedMessage = decryptMessage(message, 'your-secret-key'); // Replace with your secret key
                if (validateMessage(decryptedMessage)) {
                    const timestamp = new Date();
                    validatedMessages.push({ ...decryptedMessage, timestamp });
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        saveToMongoDB(validatedMessages);
    });
});

function decryptMessage(encryptedMessage, passKey) {
    const decipher = crypto.createDecipher('aes-256-ctr', passKey);
    const decrypted = decipher.update(encryptedMessage, 'hex', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
}

function validateMessage(message) {
    const expectedSecretKey = crypto
        .createHash('sha256')
        .update(JSON.stringify(message))
        .digest('hex');
    return message.secret_key === expectedSecretKey;
}

async function saveToMongoDB(messages) {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection(dataCollectionName);

        await collection.insertMany(messages);
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
    } finally {
        client.close();
    }
}

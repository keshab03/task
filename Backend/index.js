const io = require('socket.io-client');
const crypto = require('crypto');
const data = require('./data.json');

const socket = io.connect('http://localhost:3000'); // Replace with your listener's address

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateMessage() {
    const message = {
        name: getRandomElement(data.names),
        origin: getRandomElement(data.origins),
        destination: getRandomElement(data.destinations),
    };

    message.secret_key = crypto
        .createHash('sha256')
        .update(JSON.stringify(message))
        .digest('hex');

    return message;
}

function encryptMessage(message, passKey) {
    const cipher = crypto.createCipher('aes-256-ctr', passKey);
    const encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

function generateDataStream() {
    const numMessages = Math.floor(Math.random() * (499 - 49 + 1)) + 49;
    const messages = [];

    for (let i = 0; i < numMessages; i++) {
        const message = generateMessage();
        const encryptedMessage = encryptMessage(message, 'your-secret-key'); // Replace with your secret key
        messages.push(encryptedMessage);
    }

    return messages.join('|');
}

setInterval(() => {
    const dataStream = generateDataStream();
    socket.emit('dataStream', dataStream);
}, 10000);

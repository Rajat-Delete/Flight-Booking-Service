const amqplib = require('amqplib');

let connection;
let channel;

async function connectQueue(){
    try {
        connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();

        //It is better to assert a queue if not queue was found in Message Broker
        await channel.assertQueue('Noti-Queue');
        // setInterval(()=>{
        //     channel.sendToQueue('Noti-Queue' , Buffer.from('Something to do 123'));

        // },1000);
    } catch (error) {
        console.log(error);
    }
}

async function sendData(data){
    try {
        await channel.sendToQueue('Noti-Queue', Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    connectQueue,
    sendData,
}
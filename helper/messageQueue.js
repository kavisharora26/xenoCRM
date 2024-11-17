import amqp from 'amqplib';

class MessageQueue {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('RabbitMQ Connection Error:', error);
            throw error;
        }
    }

    async publishMessage(queue, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                persistent: true
            });
            
            console.log(`Message published to queue: ${queue}`);
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async consumeMessages(queue, callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertQueue(queue, { durable: true });
            console.log(`Waiting for messages in queue: ${queue}`);

            this.channel.consume(queue, (message) => {
                if (message) {
                    const content = JSON.parse(message.content.toString());
                    callback(content);
                    this.channel.ack(message);
                }
            });
        } catch (error) {
            console.error('Error consuming messages:', error);
            throw error;
        }
    }

    async closeConnection() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            console.log('RabbitMQ connection closed');
        } catch (error) {
            console.error('Error closing connection:', error);
            throw error;
        }
    }
}

export default new MessageQueue();
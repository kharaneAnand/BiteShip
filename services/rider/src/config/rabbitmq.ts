import amqp from 'amqplib' 

let channel :amqp.Channel ;

export const connectRabbitMQ = async()=>{
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    channel = await connection.createChannel() ;

    await channel.assertQueue(process.env.RIDER_QUEIE! ,{
        durable:true ,
    });
    await channel.assertQueue(process.env.ORDER_READY_QUEUE! ,{
        durable:true ,
    });

    console.log("🐇 Connected to RabbitMq(rider service)") ;
};

export const getChannel = ()=> channel ;
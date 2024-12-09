const {PrismaClient} = require('@prisma/client');


// const connection = mysql.createConnection({
//     host: "127.0.0.1",
//     port : 3306,
//     user : "root"
// });



// connection.connect((err) => {
//     if (err) {
//         logger.error('Error connecting to the database: ', err);
//     } else {
//         logger.info('Connected to the database successfully');
//     }
// });

const prisma = new PrismaClient();

module.exports = prisma;
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


/**
 * To migrate the database, run the following command: 
 * npx prisma migrate dev
 */

module.exports = {prisma} 
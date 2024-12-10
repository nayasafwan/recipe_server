const {PrismaClient} = require('@prisma/client');
const logger = require("../logger");


const prisma = new PrismaClient();

// class DatabaseQuery {
//     constructor() {
//         const prisma = new PrismaClient();       
//         }
// }

const createRecipe = async (recipe) =>{

    const {name, description, image, cookingTime, category, ingredients, instructions} = recipe;
    try{
        const recipe = await prisma.recipe.create({
            data : {
                name,
                description,
                image,
                cookingTime,
                category,
                ingredients : {
                    create : ingredients
                },
                instructions : {
                    create : instructions.map((instruction, index) =>({
                        name : instruction,
                        order : index + 1
                    }))
                }
            }
        })

        return recipe;
    }
    catch(err){
        logger.error('Error creating recipe: ', err);
    }
}



module.exports = {
    createRecipe
};


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
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

const getRecipes = async (args) => {
    try {
        
        const searchQuery = {}
        if (args.category){
            console.log(args.category);
            searchQuery.category = args.category;
        }

        if (args.search){
            searchQuery.name = {
                contains: args.search
            }
        }

        const condition = searchQuery.length > 1 ? {OR : searchQuery} : {...searchQuery};

        logger.info(`Getting recipes based on ${condition}`);
        return  await prisma.recipe.findMany({
            skip: args.skip,
            take: args.take,
            where: condition
        }) 
    } catch (err) {
        logger.error('Error getting recipes: ', err);
        return [];
    }
}

const searchRecipes = async (args) => {

    const searchQuery = {}

    if (args.category) {
        searchQuery.category = args.category;
    }

    if (args.search) {
        searchQuery.name = {
            contains: args.search,
            mode : "insensitive"
        }
    }

    // Check if searchQuery has more than one key to apply OR clause
    const conditions = Object.keys(searchQuery).map((key) => ({
        [key]: searchQuery[key]
    }));

    const query = conditions.length > 1 ? {OR : conditions} : {...searchQuery};
    try {
        return await prisma.recipe.findMany({
            where: query
        });
    } catch (err) {
        logger.error(`Error searching recipes with name ${args.name}: `, err);
        return []
    }
}



module.exports = {
    createRecipe,
    getRecipes,
    searchRecipes
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
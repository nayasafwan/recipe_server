const { prisma } = require("./dbInit");
const logger = require("../logger");


class DatabaseRecipe {

    async createRecipe(recipe){

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
                        create : instructions
                    }
                }
            })

            return recipe;
        }
        catch(err){
            logger.error('Error creating recipe: ', err);
        }
    }

    async getAllRecipes (){
        try {
            return await prisma.recipe.findMany({
                include : {
                    ingredients: true,
                    instructions: true
                }
            });
        } catch (err) {
            logger.error('Error getting all recipes: ', err);
            return [];
        }
    }

    async getRecipes (args) {
        try {
            
            const searchQuery = {}
            if (args.category){
                searchQuery.category = args.category;
            }

            if (args.search){
                searchQuery.name = {
                    contains: args.search
                }
            }

            const condition = searchQuery.length > 1 ? {OR : searchQuery} : {...searchQuery};

            logger.info(`Getting recipes based on ${JSON.stringify(condition)}`);
            
            const allRecipes = await prisma.recipe.findMany({
                skip: args.skip,
                take: args.take,
                where: condition,
                include : {
                    ingredients: true,
                    instructions: true
                }
            }) 

            const countRecipes = await prisma.recipe.count({
                where: condition
            })
            
            console.log({recipes : allRecipes, count : countRecipes});
            return {recipes : allRecipes, count : countRecipes};
        } catch (err) {
            logger.error('Error getting recipes: ', err);
            return [];
        }
    }

    async getRecipeById (id) {
        try {
            return await prisma.recipe.findUnique({
                where: {
                    id
                },
                include: {
                    ingredients: true,
                    instructions: true
                }
            });
        } catch (err) {
            logger.error(`Error getting recipe with id ${id}: `, err);
            return null;
        }
    }

    async countRecipes () {
        return await prisma.recipe.count();
    }

}

// const searchRecipes = async (args) => {

//     const searchQuery = {}

//     if (args.category) {
//         searchQuery.category = args.category;
//     }

//     if (args.search) {
//         searchQuery.name = {
//             contains: args.search,
//             mode : "insensitive"
//         }
//     }

//     // Check if searchQuery has more than one key to apply OR clause
//     const conditions = Object.keys(searchQuery).map((key) => ({
//         [key]: searchQuery[key]
//     }));

//     const query = conditions.length > 1 ? {OR : conditions} : {...searchQuery};
//     try {
//         return await prisma.recipe.findMany({
//             where: query
//         });
//     } catch (err) {
//         logger.error(`Error searching recipes with name ${args.name}: `, err);
//         return []
//     }
// }



module.exports = new DatabaseRecipe();


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
const { createClient } = require('redis');
const logger = require('../logger');
const recipeController = require('../controllers/recipe.controller');




class Cache {

    constructor() {
        const client = createClient()

        client.connect()
        
        client.flushAll()
        this.client = client; 
    }

    async cacheData(){
        const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Appetizer", "Dessert", "Salad", "Soup", "Beverage"];

        const allRecipes = await recipeController.getAllRecipes();

        categories.forEach(category => {
            const recipes = allRecipes.filter(recipe => recipe.category === category);
            this.client.hSet('categories', category, JSON.stringify(recipes));
        }); 

        logger.info('Cashing data');

        this.client.set('allRecipes', JSON.stringify(allRecipes));
    }

    async isCachEmptyFunc () {
        const keys = await this.client.keys('*'); 
        return keys.length === 0;  // If no keys, cache is empty
    }

}

module.exports = new Cache();
const { prisma } = require("./dbInit");


class DatabaseUser {

    async getUsername (username) {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        return user;
    }

    async getEmail (email) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        return user;
    }

    async createUser (data) {
        const { username, password, email } = data;
    
        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
                email: email,
            },
        });

        return user;
    }

    async getUserRecipes(id) {
        const recipes = await prisma.recipe.findMany({
        where: {
            user_id: id, 
        },
        include: {
            ingredients: true,
            instructions: true,
        },
        });

        return recipes
    }

}

module.exports = new DatabaseUser();
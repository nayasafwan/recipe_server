const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { graphqlHTTP } = require('express-graphql');
dotenv.config();
const { RootQuery } = require("./graphql/query")
const Mutation = require("./graphql/mutation");
const {GraphQLSchema} = require("graphql");

 


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const PORT = process.env.PORT || 8000;

const app = express();


const corsOptions = {
    origin: [FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    headers: [
        "Origin",
        "X-Api-Key",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})


app.use("/graphql", graphqlHTTP({ 
    schema,
    graphiql: true,
 }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//babel
//body parser
//eslint
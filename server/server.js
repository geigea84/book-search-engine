const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//import authorization middleware
const { authMiddleware } = require('./utils/auth');

//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//implement ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
})

//apply ApolloServer to Express server as middleware
server.applyMiddleware({ app });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

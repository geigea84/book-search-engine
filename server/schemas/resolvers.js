//Use the functionality in the user-controller.js as a guide.

//import models index.js (Book connected to User)
const { User } = require('../models');

//import AuthenticationError from ApolloServer
const { AuthenticationError } = require('apollo-server-express');

//import signToken from utils/auth
const { signToken } = require('../utils/auth');
const mongoose = require('mongoose');

//findOneAndUpdate is no longer default, update findAndModify
//https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);

//Query:
//me

//Mutation:
//login
//addUser
//saveBook
//removeBook

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { bookInputData }, context) => {
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookInputData } },
                    { new: true }
                );

                return updatedBookList;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                
                return updatedBookList;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;
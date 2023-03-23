const { GraphQLString, GraphQLNonNull } = require('graphql');
const { thing } = require('../types/thingInput');
const { thingSave, thingDelete } = require('../../sequelize/methods/thing');

const fields = {
    "savething": {
        type: GraphQLString,
        description: "Create a new thing or update one if the thing id is provided",
        args: {
            input: {
                type: thing
            }
        },
        resolve: (_, {input}) => thingSave(input)
    },
    "deletething": {
        type: GraphQLString,
        description: "Delete a thing by thing id",
        args: {
            thingId: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: (_, {thingId}) => thingDelete(thingId)
    }
}

module.exports = {
    fields
};

const { GraphQLString, GraphQLBoolean, GraphQLList, GraphQLObjectType } = require('graphql')

const previewType = new GraphQLObjectType({
    name: 'Preview',
    fields: 
    {
        thumbnail: {
            type: new GraphQLList(detailType)
        },
        large: {
            type: new GraphQLList(detailType)
        }
    }
})

const car = new GraphQLObjectType({
    "name": 'Medium',
    "fields": {
        "uid": {
            type: GraphQLString
        },
        "ownerId": {
            type: GraphQLString
        },        
        "public": { 
            type: GraphQLBoolean
        },
        "preview": {
            type: previewType
        },
        "ratio": {
            type: ratio,
            resolve: (parent, args, context) => parent.ratio ? parent.ratio : {"h": 9, "w": 16}
        },
    }
});
  
module.exports = {
    car
};

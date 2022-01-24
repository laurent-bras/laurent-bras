const { STRING, TEXT, INTEGER, BOOLEAN, UUID, UUIDV4, ENUM, ARRAY, JSONB, DATE } = require('sequelize');
const config = require('./config');

const Owner = config.define('owner', 
{
    "uid": {
        type: UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        autoIncrement: false,
        get() {
            return this.getDataValue('uid')
        }
    },
    "login": {
        type: STRING,
        get() {
            return this.getDataValue('login')
        }            
    },
    "CarId": {
        type: STRING,
        get() {
            return this.getDataValue('CarId')
        }            
    }
}, 
{
    freezeTableName: true,
    schema: 'mySchema',
    indexes: [
        {
            unique: false,
            fields: ['login']
        },
    ]
});

const Car = config.define('car', 
{
    "uid": {
        type: UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        autoIncrement: false,
        get() {
            return this.getDataValue('uid')
        } 
    },
    "name": {
        type: STRING
    },
    "model": {
        type: ENUM('XXX','XXXXXXXXX')            
    },       
    "width": {
        type: INTEGER
    },   
    "height": {
        type: INTEGER
    },
    "mediumId": {
        type: UUID,
        get() {
            return this.getDataValue('mediumId')
        } 
    },
    "truckId": {
        type: UUID,
        description:"Foreign Key"
    }
}, 
{
    freezeTableName: true,
    schema: 'mySchema',
    indexes: [
        {
            unique: true,
            fields: ['uid']
        }
    ]
});

   
    /* Association table */

async function asyncInitAssociate() {
    
    Car.hasMany(Owner, { foreignKey: 'CarId', sourceKey: 'uid', constraints: true, onDelete: 'cascade' });
    Owner.belongsTo(Car, { foreignKey: 'CarId', targetKey: 'uid', constraints: true}); 

   
}

module.exports = {
    Car,
    Owner
}

module.exports.initAssociate = () => asyncInitAssociate()

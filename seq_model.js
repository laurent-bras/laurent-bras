const { STRING, INTEGER, UUID, UUIDV4, ENUM, BOOLEAN } = require('sequelize');
const config = require('./config');

const Owner = config.define('owner', 
{
    "uid": {
        type: UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        autoIncrement: false,
    },
    "login": {
        type: STRING,         
    },
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
    },
    "name": {
        type: STRING
    },
    "model": {
        type: ENUM('PSA','RENAULT')            
    },       
    "width": {
        type: INTEGER
    },   
    "height": {
        type: INTEGER
    },
    "readOnly": {
        type: BOOLEAN
    },
    "ownerId": {
        type: STRING,    
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

const Wheel = config.define('wheel', 
{
    "uid": {
        type: UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
        autoIncrement: false,
    },
    "name": {
        type: STRING
    },      
    "size": {
        type: INTEGER
    },   
    "readOnly": {
        type: BOOLEAN
    },
    "carId": {
        type: STRING,    
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
   
const initAssociate = () => {
    return new Promise((resolve, reject) => {
        try {
            Car.belongsTo(Owner, { foreignKey: 'ownerId', targetKey: 'uid', constraints: true}); 
            Owner.hasMany(Car, { foreignKey: 'ownerId', sourceKey: 'uid', constraints: true, onDelete: 'cascade' });
            
            Wheel.belongsTo(Car, { foreignKey: 'carId', targetKey: 'uid', constraints: true}); 
            Car.hasMany(Wheel, { foreignKey: 'carId', sourceKey: 'uid', constraints: true, onDelete: 'cascade' });
            
            resolve({
                msg: "ok"
            });
        } catch (error) {
            reject({
                msg: "Failed to load sequelize model",
                error,
            })
        }
    });
}

module.exports = {
    Car,
    Owner,
    Wheel,
    initAssociate,
}

const { Op } = require('sequelize') 
const { Car, Wheel } = require('../models');
const { setReadOnlyOnCars } = require('../tools/read-only');
const { getListOfGarages } = require('../tools/rules');

const getCarsByOwnerId = (ownerId) => {
    return new Promise( async (resolve, reject) => {
        
        let garages = [];
        try {
            garages = await getListOfGarages(ownerId);
            
        } catch (error) {
            return reject({
                msg: "Failed to retrieve list of garages"
            })
        }
        if (garages.length < 1) {
            return resolve({
                msg: "List of garages empty",
                result: [],
            })
        };
        const owners = garages.map((own) => own.uid);
    
        const cars = await Car.findAll({
            where: {
                ownerId: {
                    [Op.in]: owners,   
                }
            },
            order: [['color','ASC']],
            include: 
                [{
                    model: Wheel,
                }]
        });
    
        const cars2 = cars.map((car) => car.toJSON());
    
        // check read only 
        const cars3 = await setReadOnlyOnCars(cars2, ownerId);
        
        // set read only on wheels like cars
        for (const car3 of cars3) {
            const readOnlyCar = car3.readOnly;
            for (const wheel of car3.wheels) {
                wheel.readOnly = readOnlyCar;
            }
        }
    
        resolve({
            msg: "ok",
            result: cars3,
        })
    });
}

module.exports = {
    getCarsByOwnerId
};

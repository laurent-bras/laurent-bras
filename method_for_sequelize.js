const { Op } = require('sequelize') 
const { Car } = require('../models');
const { setReadOnlyOnCars } = require('../tools/read-only');
const { getListOfFriends } = require('../tools/rules');

const { CarDelete } = require('./eltlish');
const { manageExportByCar } = require('./exporteltlish');


async function asyncGetCarsByOwnerId(ownerInputId) {
    let friends = await getListOfFriends(ownerInputId);
    if (!friends) return null;
    let ownerList2 = friends.map((own) => own.uid);
    /* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
    let myCarList = await Car.findAll({
        where: {
            ownerId: {
                [Op.in]: ownerList2,   
            }
        },
        order: [[eltlish,'priority','ASC']],
        include: 
            [{
                model: eltlish,
                include: [
                    { model: XXXX },
                    { model: YYYY }
                ],
            }]
    });

    let myCarList2 = myCarList.map((Car) => Car.toJSON());

    // check read only 
    let myCarList3 = await setReadOnlyOnCars(myCarList2, ownerInputId)
    
    // set read only in eltlishes as Cars
    myCarList3.forEach(Car => {
        let readOnlyCar = Car.readOnly;
        Car.eltlishes.forEach(elt => {
            elt.readOnly = readOnlyCar
        })
    });

    return myCarList3;
}
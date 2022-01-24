const expect = require('chai').expect;
const { initDBClear } = require('../../js/sequelize/init');
const { getToken } = require('../../js/check-auth');
const configuration = require('../../js/configuration')



const app = require('../js/server');

const request = require('supertest')(app)

const token = getToken();
// UUID V4
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const user = {};

async function initialize(done) {
    await initDBClear();
    app.listen(configuration.serverPort, () => done())
};

describe('Server', function() {
    before((done) => {
        initialize(done);
    })

    after((done) => {
        done(); 
    })

    it('should not be able to consume the route since no token was sent', done => {
        const query = 'mutation { saveOwner( input: { login: "johnny.testman", CarId: "ABCDE123456" }) }'
        request.post('/owners')
        .send({ query: query })
        .expect(401, done)
    })

    it('get lunches details by sites', done => {
        const lunchResponse = `{"data":{"getLunchesBySitesId":[{"id":"4664645566","name":"XXXXXXX","car":"XXXXXX","longitude":"1","latitude":"59"},{"id":"XXXXXXXXXX",............`
        const query = `{ getLunchesBySitesId(lunchCode: ["XXXXXXXXXXX", "YYYYYYY", "ZZZZZZ"]) { id:lunchCode, name:lunchName, car, longitude, latitude   } }`
        request.post('/lunches')
        .set("Authorization", token)
        .send({ query: query })
        .expect(200)
        .then(res => {
            expect(res.text).to.be.equal(lunchResponse); 
            user.lunchId = JSON.parse(res.text).data.getLunchesBySitesId[0].id;
            done();
        })
        .catch(err => done(err))
    })
});
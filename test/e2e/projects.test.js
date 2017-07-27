const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/projects-test';

require('../../lib/connect');

const connection = require ('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe.only('projects REST api', () => {

    before (() => connection.dropDatabase());

    const demo = {
        name: 'KESdemo',
        projectNo: 20170301,
        equipment: {
            needed: [
                'dozer',
                '400 excavator',
                'mini excavator'
            ]
        },
        employees: { needed: ['Bob', 'Dave', 'Doug']},
        endDate: 'Feb. 24, 2018',
        contractPrice: '$160,000'
    };

    const road = {
        name: 'Snowden Rd',
        projectNo: 20170502,
        equipment: [
            'dozer',
            '400 excavator',
            '300 excavator'
        ],
        employees: ['Bob', 'Dave', 'Stan', 'Ian'],
        endDate: 'Aug. 02, 2018',
        contractPrice: '$180,500'
    };

    const demo2 = {
        name: 'Lucky Star Restaurant',
        projectNo: 20171101,
        equipment: [
            '400 excavator',
            '300 excavator'
        ],
        employees: ['Bob', 'Dave'],
        endDate: 'Dec. 23, 2017',
        contractPrice: '$60,000'
    };

    function saveProject(project) {
        return request.post('/projects')
            .send(project)
            .then(({ body }) => {
                project._id = body._id;
                project.__v = body.__v;
                return body;
            });
    }

    it('saves a project', () => {
        return saveProject(demo)
            .then(savedProject => {
                assert.isOk(savedProject._id);
                assert.deepEqual(savedProject, demo);
            });
    });

    it('gets a saved project by id', () => {
        return request
            .get(`/projects/${demo._id}`)
            .then( res => res.body )
            .then( gotProject => {
                assert.deepEqual(gotProject, demo);
            });
    });

    it('returns error if faulty id is passed for get request', () => {
        return request
            .get('/projects/2893416183148751961346ade')
            .then(
                () => { throw new Error('successful status code not expected');},
                ({ response }) => {
                    assert.equal(response.status, 500);
                    assert.isOk(response.error);
                }
            );
    });

    it('returns a list of saved projects', () => {
        return Promise.all([
            saveProject(road),
            saveProject(demo2)
        ])
            .then(() => request.get('/projects'))
            .then(res => {
                const projects = res.body;
                assert.equal(projects.length, 3);
                assert.equal(projects[0]._id, demo._id);
                assert.equal(projects[1]._id, road._id);
                assert.equal(projects[2]._id, demo2._id);
            });
    });

    it('deletes an object by a given id', () => {
        return request.delete(`/projects/${demo2._id}`)
            .then( res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, { removed: true });
            });
    });
});
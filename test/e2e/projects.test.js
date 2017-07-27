const chai = require('chai');
const { assert } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/projects-test';

require('../../lib/connect');

const connection = require ('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('projects REST api', () => {

    before (() => connection.dropDatabase());

    const demo = new Project({
        name: 'KESdemo',
        projectNo: 20170301,
        equipment: [
            'dozer',
            '400 excavator',
            'mini excavator'
        ],
        employees: ['Bob', 'Dave', 'Doug'],
        endDate: 'Feb. 24, 2018',
        contractPrice: '$160,000'
    });

    const road = new Project({
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
    });

    const demo2 = new Project({
        name: 'Lucky Star Restaurant',
        projectNo: 20171101,
        equipment: [
            '400 excavator',
            '300 excavator'
        ],
        employees: ['Bob', 'Dave'],
        endDate: 'Dec. 23, 2017',
        contractPrice: '$60,000'
    });

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
});
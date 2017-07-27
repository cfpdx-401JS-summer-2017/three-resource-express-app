const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/job-search-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('Job REST api', () => {

    beforeEach(() => connection.dropDatabase());

    function save(job) {
        return request.post('/jobs') //why this?
            .send(job)
            .then(({ body }) => {
                job._id = body._id;
                job.__v = body.__v;
                job.interview = body.interview;
                job.url = body.url;
                return body;
            });
    }

    it('saves a job', () => {
        let newJob = {
            position: 'JavaScript Developer',
            company: 'Facebook, Inc.',
            applied: true,
            url: 'www.facebook.com'
        };

        return save(newJob)
            .then(savedJob => {
                assert.isOk(savedJob._id);
                assert.deepEqual(savedJob, newJob);
            });
    });

    it('gets all jobs', () => {
        let jobs = [{
            position: 'Software Developer',
            company: 'Apple, Inc.',
            applied: false
        },{
            position: 'Software Engineer',
            company: 'Amazon',
            applied: true
        }];

        return Promise.all(jobs.map(save))
            .then(saved => jobs = saved)
            .then(() => request.get('/jobs'))
            .then(res => {
                const saved = res.body.sort((a, b) => a._id > b._id ? 1 : -1 );
                assert.deepEqual(saved, jobs);
            });
    });

    it('gets job by id', () => {
        let job = {
            position: 'NodeJS Developer',
            company: 'LinkedIn',
            applied: true,
            url: 'www.somejobatlinkedin.com'
        };

        return save(job)
            .then(res => res.body = job)
            .then(job => request.get(`/jobs/${job._id}`))
            .then(res => {
                assert.deepEqual(res.body, job);
            });
    });

    it('removes jobs by id', () => {
        let job = {
            position: 'Window Washer',
            company: 'ACME',
            applied: false,
            url: 'www.lame-jobs.com'
        };

        return save(job)
            .then(res => res.body = job)
            .then(job => request.delete(`/jobs/${job._id}`))
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it.skip('updates job by id', () => {
        let job = {
            position: 'JavaScript Developer',
            company: 'Intel',
            applied: false
        };
        let jobUpdate = { applied: true };

        return save(job)
            .then(res => res.body = job)
            .then(job => request.put(`/jobs/${job._id}`).send(jobUpdate))
            .then(res => {
                assert.deepEqual(res.body.applied, jobUpdate.applied);
            });
    });

});

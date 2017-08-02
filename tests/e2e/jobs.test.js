const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe.skip('Job REST api', () => {

    beforeEach(() => db.drop());

    function save(job) {
        return request.post('/api/jobs')
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
            .then(() => request.get('/api/jobs'))
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
            .then(job => request.get(`/api/jobs/${job._id}`))
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
            .then(job => request.delete(`/api/jobs/${job._id}`))
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it('updates job by id', () => {
        let newJob = {
            position: 'JavaScript Developer',
            company: 'Intel',
            applied: false
        };
        let jobUpdate = { applied: true };

        return save(newJob)
            .then(res => res.body = newJob)
            .then(job => request.put(`/api/jobs/${job._id}`).send(jobUpdate))
            .then(res => {
                assert.deepEqual(res.body.applied, jobUpdate.applied);
            });
    });

});

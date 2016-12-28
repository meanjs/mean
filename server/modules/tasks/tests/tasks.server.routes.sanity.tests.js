'use strict';

import test from 'ava';
import app from '../../../config/lib/app';
import supertest from 'supertest';

/**
 * Pre-condition for this test is to run on a clean database setup with no records existing
 */

// Bootstrap the application components (db, orm and express app)
// Make the components available to tests through the shared object `t.context`
var appComponents;
function bootstrapTest() {
  return app.bootstrap();
}

// Before all tests would run we will bootstrap the ExpressJS app server
// and it's related components (Mongoose DB and Sequelize ORM)
test.before('Bootstrapping App for Tasks Routes test', async t => {

  appComponents = await bootstrapTest();

  t.truthy(appComponents.db, 'bootstrapped with db property');
  t.truthy(appComponents.orm, 'bootstrapped with orm property');
  t.truthy(appComponents.app, 'bootstrapped with app property');
});

test('API: Get All Tasks for anonymous user', async t => {
  let response = await supertest(appComponents.app)
    .get('/api/tasks')
    .expect(200);

  t.is(200, response.statusCode, 'successful');
  t.true(response.body.length === 0, 'returns empty results');

});

test('API: Get My Tasks for anonymous user', async t => {
  let response = await supertest(appComponents.app)
    .get('/api/tasks/me')
    .expect(401);

  t.is(401, response.statusCode, 'successful');
  t.true(response.body.message == 'No session user', 'No session user');

});

test('API: Create Task with anonymous user', async t => {
  let response = await supertest(appComponents.app)
    .post('/api/tasks')
    .expect(401);

  t.is(401, response.statusCode, 'successful');
  t.true(response.body.message == 'No session user', 'No session user');

});

test('API: Update Task with anonymous user', async t => {
  let response = await supertest(appComponents.app)
    .put('/api/tasks')
    .expect(401);

  t.is(401, response.statusCode, 'successful');
  t.true(response.body.message == 'No session user', 'No session user');

});

test('API: Delete Task with anonymous user', async t => {
  let response = await supertest(appComponents.app)
    .delete('/api/tasks')
    .expect(401);

  t.is(401, response.statusCode, 'successful');
  t.true(response.body.message == 'No session user', 'No session user');

});

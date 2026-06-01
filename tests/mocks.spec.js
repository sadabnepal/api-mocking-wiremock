const axios = require('axios');
const { expect } = require('chai');

const BASE = 'http://localhost:8080';
const client = axios.create({
  baseURL: BASE,
  validateStatus: null
});

describe('Users API - WireMock', () => {

  describe('GET /users', () => {
    it('should return all users with status 200', async () => {
      const res = await client.get('/users');

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('array');
      expect(res.data.length).to.be.greaterThan(0);
    });

    it('should return users with required fields', async () => {
      const res = await client.get('/users');

      res.data.forEach(user => {
        expect(user).to.have.property('id');
        expect(user).to.have.property('name');
        expect(user).to.have.property('email');
      });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user with status 200', async () => {
      const res = await client.get('/users/3');

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('object');
      expect(res.data).to.have.property('id');
      expect(res.data).to.have.property('name');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await client.get('/users/999');

      expect(res.status).to.equal(404);
      expect(res.data).to.have.property('error');
      expect(res.data.code).to.equal('USER_404');
    });
  });

  describe('GET /users?slow=true', () => {

    it('should respond after simulated delay', async () => {
      const start = Date.now();
      const res = await client.get('/users?slow=true', { timeout: 10000 });
      const elapsed = Date.now() - start;

      expect(res.status).to.equal(200);
      expect(elapsed).to.be.at.least(3000);
    });
  });

  describe('POST /users', () => {

    it('should create a user and return 201 with echoed data', async () => {
      const payload = { name: 'Jane Doe', email: 'jane@example.com' };
      const res = await client.post('/users', payload);

      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('id');
      expect(res.data.name).to.equal(payload.name);
      expect(res.data.email).to.equal(payload.email);
    });

    it('should return 201 with a createdAt timestamp', async () => {
      const res = await client.post('/users', {
        name: 'John Smith',
        email: 'john@example.com'
      });

      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('createdAt');
    });
  });

});
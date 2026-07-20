import { create } from 'axios';
import { expect } from 'chai';

const BASE = 'http://localhost:8080';
const request = create({ baseURL: BASE, validateStatus: null });

describe('Users API - WireMock', () => {

  describe('GET /users', () => {

    it('should return all users with status 200', async () => {
      const response = await request.get('/users');

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.greaterThan(0);
    });

    it('should return users with required fields', async () => {

      const response = await request.get('/users');

      response.data.forEach(user => {
        expect(user).to.have.property('id');
        expect(user).to.have.property('name');
        expect(user).to.have.property('email');
      });
    });

  });

  describe('GET /users/:id', () => {
    it('should return a single user with status 200', async () => {
      const response = await request.get('/users/2');

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('object');
      expect(response.data).to.have.property('id');
      expect(response.data).to.have.property('name');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request.get('/users/999');

      expect(response.status).to.equal(404);
      expect(response.data).to.have.property('error');
      expect(response.data.code).to.equal('USER_404');
    });
  });

  describe('GET /users?slow=true', () => {

    it('should respond after simulated delay', async () => {
      const start = Date.now();
      const response = await request.get('/users?slow=true', { timeout: 10000 });
      const elapsed = Date.now() - start;

      expect(response.status).to.equal(200);
      expect(elapsed).to.be.at.least(3000);
    });
  });

  describe('POST /users', () => {

    it('should create a user and return 201 with echoed data', async () => {
      const payload = { name: 'Jane Doe', email: 'jane@example.com' };
      const response = await request.post('/users', payload);

      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('id');
      expect(response.data.name).to.equal(payload.name);
      expect(response.data.email).to.equal(payload.email);
    });

    it('should return 201 with a createdAt timestamp', async () => {
      const response = await request.post('/users', {
        name: 'John Smith',
        email: 'john@example.com'
      });

      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('createdAt');
    });
  });

});
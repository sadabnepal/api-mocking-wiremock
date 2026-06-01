const axios = require('axios');

const WIREMOCK_ADMIN = 'http://localhost:8080/__admin/mappings';

async function setupMocks() {
    // POST /createUser
    await axios.post(WIREMOCK_ADMIN, {
        request: {
            method: 'POST',
            url: '/createUser'
        },
        response: {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            jsonBody: {
                success: true,
                message: 'User created',
                userId: '123'
            }
        }
    });

    // GET /getUser
    await axios.post(WIREMOCK_ADMIN, {
        request: {
            method: 'GET',
            url: '/getUser'
        },
        response: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            jsonBody: {
                userId: '123',
                name: 'John Doe',
                email: 'john@example.com'
            }
        }
    });

    console.log('✅ Mocks registered successfully!');
}

setupMocks().catch(console.error);
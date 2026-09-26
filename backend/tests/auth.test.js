const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(20000);

describe('SafeCity Authentication & Verification API', () => {
  describe('POST /api/auth/login', () => {
    it('should reject invalid credentials with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@safecity.local', password: 'WrongPassword123!' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should authenticate the admin user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@safecity.local', password: 'SafeCity@2026' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('admin');
    });
  });

  describe('POST /api/auth/google', () => {
    it('should authenticate or provision a Google user', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({
          email: 'ci_test_user@gmail.com',
          name: 'CI Test User',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('ci_test_user@gmail.com');
    });

    it('should require an email address', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ name: 'No Email User' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });
});

import chai from 'chai';
import supertest from 'supertest';
import env from '../config/enviroment.config.js';

const PORT = env.port;

const expect = chai.expect;
const requester = supertest.agent(`http://localhost:${PORT}`);
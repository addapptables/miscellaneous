require('ts-node/register');

const chai = require('chai')
// .use(require('chai-as-promised'));

// Chai
global.chai = chai;
global.expect = chai.expect;
global.should = chai.should;

should();
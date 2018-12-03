const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const should = chai.should();
const fileContent = require('../src/fileRead');
const expect = require('chai').expect;
const mock = require('mock-fs');
const path = require('path');
const supertest = require('supertest');

chai.use(chaiHttp);

describe('server tests', () => {
  it('should return 200 for the root request', (done) => {
    chai.request(server)
    .get('/')
    .end((err, res) => {
      res.should.have.status(200);
      expect(res.text).to.equal("This is the root folder.");
      done();
    });
  });

  describe('String Test', () => {
    it('should return the first non repeating character for a valid string being passed', (done) => {
      chai.request(server)
      .get('/stringTest')
      .query({"text" : "string"})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal("First non-repeating character in the text is s");
        done();
      });
    });
    it('should return no non-repeating character if no non-repeating character was found', (done) => {
      chai.request(server)
      .get('/stringTest')
      .query({"text" : "aabbcc"})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal("There is no non-repeating character in the given text");
        done();
      });
    });
    it('should return valid message for empty parameter', (done) => {
      chai.request(server)
      .get('/stringTest')
      .query({"text" : ""})
      .end((err, res) => {
        expect(res.text).to.equal("There is no non-repeating character in the given text");
        done();
      });
    });
  });

  describe('Product', () => {
    it('should return valid response for the parameters provided', (done) => {
      chai.request(server)
      .get('/product')
      .query({"value1" : "3", "value2" : "6"})
      .end((err, res) => {
        expect(res.text).to.equal("The product of the given numbers are 18");
        done();
      });
    });
    it('should return message for invalid input value', (done) => {
      chai.request(server)
      .get('/product')
      .query({"value1" : "a", "value2" : "6"})
      .end((err, res) => {
        expect(res.text).to.equal("Please enter valid integers for value1 and value2");
        done();
      });
    });
    it('should return message for missing input value', (done) => {
      chai.request(server)
      .get('/product')
      .query({"value1" : "a"})
      .end((err, res) => {
        expect(res.text).to.equal("Please enter valid integers for value1 and value2");
        done();
      });
    });
  });

  describe('File Reader', () => {
    beforeEach(() => {
      mock({
        'files': {
          'one.txt': 'first file'
        }
      });
    });
    afterEach(mock.restore);

    it('should return the file content', () => {
      expect(fileContent('files/one.txt')).to.equal('first file');
    });
  });

  // describe('File Upload', () => {
  //   var request = supertest('localhost:3001');
  //   let newPath = path.join(__dirname,'../mock/');
  //   it('should upload the given file into the file directory', (done) => {
  //      request.post('/upload')
  //         .attach('text', newPath+'testfile.txt')
  //         .end((err, res) => {
  //             //res.should.have.status(200); // 'success' status
  //             done();
  //         });
  //   });
  // });
});

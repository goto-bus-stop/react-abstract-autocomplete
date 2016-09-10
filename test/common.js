import { jsdom } from 'jsdom';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

before(() => {
  const document = jsdom('<!doctype html><html><body></body></html>');
  global.window = { document };
  global.document = document;
});

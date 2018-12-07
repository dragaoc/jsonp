'use strict';
require('./support');

const expect = require('expect.js'),
  nock = require('nock'),
  handleRequest = require('../../server/worker-helper');

describe('CloudFlare Worker', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('gives a status of 502 for a non-existent page', () => {
    const req = new Request('http://jsonp.test/?url=http://localhost:8001');
    return handleRequest(req).catch(err => {
      expect(err.code).to.be('ECONNREFUSED');
    });
  });

  it('passes the JSON and set the CORS headers', async () => {
    const destHost = 'http://localhost:8001';
    const json = { message: 'test' };
    nock(destHost)
      .get('/')
      .reply(200, json);

    const req = new Request(`http://jsonp.test/?url=${destHost}`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    expect(res.headers.get('access-control-allow-origin')).to.eql('*');
    const data = await res.json();
    expect(data).to.eql(json);
  });

  it('includes the status and headers', async () => {
    const destHost = 'http://localhost:8001';
    nock(destHost)
      .get('/')
      .reply(202, '', {
        'x-foo': 'bar'
      });

    const req = new Request(`http://jsonp.test/?url=${destHost}`);
    const res = await handleRequest(req);

    expect(res.status).to.be(202);
    expect(res.headers.get('x-foo')).to.eql('bar');
  });

  it('supports JSONP', async () => {
    const destHost = 'http://localhost:8001';
    const json = { message: 'test' };
    nock(destHost)
      .get('/')
      .reply(200, json);

    const req = new Request(`http://jsonp.test/?url=${destHost}&callback=foo`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    expect(res.headers.get('content-type')).to.eql('text/javascript');
    const data = await res.text();
    expect(data).to.eql('foo({"message":"test"});');
  });

  it('renders the homepage', async () => {
    const req = new Request(`http://jsonp.test/`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    expect(res.body).to.contain('Cross-domain AJAX');
  });
});

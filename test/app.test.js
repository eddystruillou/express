import supertest from 'supertest'
import app from '../src/app'
import should from 'should'

describe('GET/Movies', () => {
  it('should send a list of movies', done => {
    supertest(app)
    .get('/Movies')
    .expect(200)
    .expect(res => {
      should.exist(res.body)
      res.body.should.be.a.Array
      res.body.should.have.length > 0
      res.body[0].should.have.only.keys('id', 'title', 'imagesURL')
    })
    .end(done)
  })

  it('should send a full movie', done => {
    supertest(app)
    .get('/filtreMovies/1')
    .expect(200)
    .expect(({ body }) => {
      should.exist(body)
      body.should.be.a.Object
      body.should.have.only.keys('id', 'title', 'imagesURL', 'synopsis')
    })
    .end(done)
  })

  it('should send a error 404', done => {
    supertest(app)
    .get('/filtreMovies/666')
    .expect(404)
    .expect(res => {
      should.exist(res.body)
      res.body.should.not.be.empty
    })
    .end(done)
  })
})


describe('POST/Movies', () => {
  it('should send a new movie', done => {
    supertest(app)
    .post('/Movies')
    .send({title: 'JeanMoule', imagesURL: 'CeciEstUnLinkImage', synopsis: 'Film avec de l"action en masse !' })
    .expect(200)
    .expect(res => {
      should.exist(res.body)
      res.body.should.be.a.Object
      res.body.should.have.only.keys('id', 'title', 'imagesURL', 'synopsis')
    })
    .end(done)
  })

  it('should send a error 404', done => {
    supertest(app)
    .post('/Movies')
    .expect(400)
    .expect(res => {
      should.exist(res.body)
      res.body.should.be.Array
    })
    .end(done)
  })
})

describe('DELETE/filtreMovies/:id', () => {
  it('should delete a movie', done => {
    supertest(app)
    .delete('/filtreMovies/2')
    .expect(200)
    .end(() => {
      supertest(app)
      .get('/filtreMovies/2')
      .expect(404)
      .end(done)
    })
  })
})

describe('UPDATE/Movies/:id', () => {
  it('should update a movie', done => {
    supertest(app)
    .post('/Movies')
    .send({id: 1, title: 'Ahouioui', imagesURL: 'CeciEstUnLinkImagev2', synopsis: 'Film avec de l"action en massive' })
    .expect(200)
    .expect(res => {
      should.exist(res.body)
      res.body.should.be.a.Object
      res.body.should.have.only.keys('id', 'title', 'imagesURL', 'synopsis')
    })
    .end(done)
  })

  it('should not update a movie', done => {
    supertest(app)
    .post('/Movies/666')
    .expect(404)
    .expect(res => {
      should.exist(res.body)
      res.body.should.be.Array
    })
    .end(done)
  })
})

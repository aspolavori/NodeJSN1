const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryInd = repositories.findIndex(
    (repository) => repository.id == id,
  );

  if (findRepositoryInd == -1) {
    return response.status(400).json({ error: 'Esse dado nao existe' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryInd].likes,
  };

  repositories[findRepositoryInd] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const findRepositoryInd = repositories.findIndex(
    (repository) => repository.id == id,
  );

  if (findRepositoryInd >= 0) {
    repositories.splice(findRepositoryInd, 1);
  } else {
    return response.status(400).json({ error: 'Não Existe' });
  }

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const findRepositoryInd = repositories.findIndex(
    (repository) => repository.id == id,
  );

  if (findRepositoryInd == -1) {
    return response.status(400).json({ error: 'Esse dado não existe' });
  }

  repositories[findRepositoryInd].likes++;

  return response.json(repositories[findRepositoryInd]);
});

module.exports = app;

const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response , next) {
  const {id} = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: "Invalid id" })
  }

  return next()
}
app.use('/repositories/:id',validateId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  
  if(repoIndex < 0) {
    return response.status(400).json({error:"Repository not found"})
  }
  
  const repo = {
    ...repositories[repoIndex],
    title,
    url,
    techs,
  }

  repositories[repoIndex] = repo;

  return response.json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({error:"Repository not found"})
  }

  repositories.splice(repoIndex,1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({error:"Repository not found"})
  }

  repositories[repoIndex].likes++;
  
  return response.json(repositories[repoIndex])
});

module.exports = app;

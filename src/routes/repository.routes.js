import express from "express"; 
import * as repoController from "../controllers/repository.controller.js"; 
import {authMiddleware} from "../middlewares/auth.middleware.js"; 

const repoRouter = express.Router(); 

repoRouter.use(authMiddleware);
//finding the list and importing 
repoRouter.get("/discovery", repoController.getGithubRepos); 
repoRouter.post('/import', repoController.importRepo);

//CRUD functinoalities 
repoRouter.get('/', repoController.getActiveRepos); 
repoRouter.get('/:id', repoController.getActiveRepo); 
repoRouter.patch('/:id', repoController.updateRepo); 
repoRouter.delete('/:id', repoController.deleteRepo); 

//sync with github 
repoRouter.post('/:id/sync', repoController.manualSync); 
repoRouter.post('/:id/tags', repoController.addTags); 

export default repoRouter;  
import express from "express"; 
import * as repoController from "../controllers/repository.controller.js"; 
import * as activityController from "../controllers/activity.controller.js"; 
import * as exploreController from "../controllers/explore.controller.js"; 
import {authMiddleware} from "../middlewares/auth.middleware.js"; 

const repoRouter = express.Router(); 

repoRouter.use(authMiddleware);
//finding the list and importing 
repoRouter.get("/discovery", repoController.getGithubRepos); 
repoRouter.post('/import', repoController.importRepo);


// explore pubilc repos globally

repoRouter.get('/explore', authMiddleware, exploreController.explorePublicRepos)
repoRouter.get('/topics', authMiddleware, exploreController.getPopularTopics);
repoRouter.post('/topics', authMiddleware, exploreController.createTag); 
repoRouter.delete('/topics/:id', authMiddleware, exploreController.deleteTag); 



// explore pubilc repos globally

repoRouter.get('/explore', authMiddleware, exploreController.explorePublicRepos)
repoRouter.get('/topics', authMiddleware, exploreController.getPopularTopics);
repoRouter.post('/topics', authMiddleware, exploreController.createTag); 
repoRouter.delete('/topics/:id', authMiddleware, exploreController.deleteTag); 


//creating repos and workspaces
repoRouter.post('/create-workspace', repoController.createWorkspace);
repoRouter.post('/create-remote', repoController.createRemoteRepo);

//repository file management 
repoRouter.get('/contents', repoController.getContents);
repoRouter.put('/:id/contents', repoController.updateFile);

//language
repoRouter.get('/languages', repoController.getRepoLanguages);
//CRUD functinoalities 
repoRouter.get('/', repoController.getActiveRepos); 
repoRouter.get('/:id', repoController.getActiveRepo); 
repoRouter.patch('/:id', repoController.updateRepo); 
repoRouter.delete('/:id', repoController.deleteRepo); 

//sync with github 
repoRouter.post('/:id/sync', repoController.manualSync); 
repoRouter.post('/:id/tags', repoController.addTags); 

// getting a specific repo history
repoRouter.get('/:id/activity',activityController.getRepoActivity )

export default repoRouter;  
import axios from "axios";
import { Repository } from "../models/repository.model";



export const repositoryService = {
    syncUserRepos: async (user, accessToken) => {
        try {
            const repoRes = await axios.get("https://api.github.com/user/repos", {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                },
                                params: {
                                    type: 'owner',
                                    sort: 'updated',
                                    per_page:100
                                }
                            });
            
            
            
            const reposObjectIds = await Promise.all(repoRes.data.map( async (repo) => {
                            const r = await Repository.findOneAndUpdate(
                                    {name: repo.full_name}, // using repo's full name for unique identification
                                    {
                                        name: repo.full_name,
                                        description: repo.description,
                                        ownerId: user._id, // linking to the user first saved
                                    },
                                    {upsert: true, new:true}
            
                                );
            
                                return r._id
                            }
                            ));
            user.reposOwned = reposObjectIds;
            await user.save();
            return reposObjectIds;
        } catch (error) {
            console.error("Repo Sync error:", error);
            throw error;
        }
    }
}

import { StatusCodes } from "http-status-codes";
import { createGitHubClient } from "../config/github.js";

import { Repository } from "../models/repository.model.js";
import { getOrSetCache } from "../utils/cache.util.js";
import redisClient from "../config/redis.js";
import { getLanguageColor } from "../utils/githubColors.js";
import {Tag} from "../models/tag.model.js";
import { createLog } from "../utils/activity.util.js";




//@desc 9. Explore pubilc repos by tag
//@route GET /api/repos/explore

export const explorePublicRepos = async (req,res) => {
  try {
    const {page = 1, q , tag} = req.query;
    const perPage = 6;
    const pageNum = parseInt(page);
    const cacheKey = `explore:v5:q=${q || 'all'}:tag=${tag || 'none'}:page=${pageNum}`

    const data = await getOrSetCache(cacheKey, async () => {
      const octokit = createGitHubClient(req.user.accessToken)

      //Global search: includes all users, filtered by stars for quality
      let query = "is:pubilc stars:>50";
      if (q) query += ` ${q}`;
      if (tag) query += ` topic:${tag}`;

      const {data:searchResults} = await octokit.rest.search.repos({
        q:query,
        sort: "updated",
        per_page: perPage,
        page:pageNum,
      });


      const githubIds = searchResults.items.map(repo => repo.id.toString());
      const existingRepos = await Repository.find({
        githubId: { $in: githubIds },
      }).select("githubId -_id");

      const existingIdsSet = new Set(existingRepos.map(r => r.githubId));


      // map and fetching the language stats in parallel

      const repos = await Promise.all(
        searchResults.items.map(async (repo) => {
          try {
            const {data: langData} = await octokit.rest.repos.listLanguages({
              owner: repo.owner.login,
              repo:repo.name,
            });

            const total = Object.values(langData).reduce((a,b) => a + b, 0);
            const languages = Object.entries(langData).map(([label, bytes]) => ({
                label, 
                value: parseFloat(((bytes/total)* 100).toFixed(1)),
                color: getLanguageColor(label)
            })).filter(l => l.value > 1.0).sort((a,b)=> b.value - a.value);


            return {
              githubId:repo.id.toString(),
              name: repo.name,
              owner: repo.owner.login,
              avatar: repo.owner.avatar_url,
              description: repo.description,
              stars: repo.stargazers_count,
              url: repo.html_url,
              tags: repo.topics || [],
              languages,
              isImported: existingIdsSet.has(repo.id.toString()),

            }

          } catch (error) {
            
            return {}
          }
        })
      );

      return {
        total: searchResults.total_count, 
        repos,
        hasNextPage :searchResults.total_count > (pageNum * perPage)
      };
    }, 3600)

    res.status(StatusCodes.OK).json({
      status: "success",
      data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  
  }
}

// @desc 10. Tag Topic Cloud - curated top industry topics for the discovery page
// @route GET /api/repos/topics

export const getPopularTopics = async (req,res)=>{
  try {
    // Manually curated list - //@todo: color can be changed later
    const curatedTopics = [
      { name: "health", label: "Health", color: "#4c7abcff" },
      { name: "agriculture", label: "Agriculture", color: "#50634bff" },
      { name: "government", label: "Government", color: "#4b5563" },
      { name: "system-programming", label: "System programming", color: "#4b5563" },
      { name: "web-development", label: "Web development", color: "#4b5563" },
      { name: "front-end", label: "Front-end", color: "#4b5563" },
      { name: "full-stack", label: "Full-stack", color: "#4b5563" },
      { name: "back-end", label: "Back-end", color: "#4b5563" },
      { name: "aerospace", label: "Aerospace", color: "#4b5563" },
      { name: "java", label: "Java", color: "#4b5563" },
      { name: "php", label: "PHP", color: "#4b5563" },
      { name: "ui-ux", label: "UI/UX", color: "#4b5563" },
      { name: "javascript", label: "JavaScript", color: "#4b5563" },
      { name: "cpp", label: "C++", color: "#4b5563" },
      { name: "rust", label: "Rust", color: "#4b5563" },
      { name: "linux", label: "Linux", color: "#4b5563" },
      { name: "kernel", label: "Kernel", color: "#4b5563" }
    ];
    const cacheKey = "explore:db_tags";

    const dbTags = await getOrSetCache(cacheKey, async()=> {
      // optional implementation
      // const octokit = createGitHubClient(req.user.accessToken);

      // // fetch top 100 most starred repos globally to find what's trending

      // const {data:searchResults} = await octokit.rest.search.repos({
      //   q: "stars:>10000",
      //   sort: "stars",
      //   order:"desc",
      //   per_page:100,
      // })

      // // aggerate and count tpics

      // const topicCounts = {};
      // searchResults.items.forEach(repo=> {
      //   (repo.topics || []).forEach(topic => {
      //     topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      //   })
      
      // })

      // // converting to array and sorting by freq and formating
      // return Object.entries(topicCounts).map(([name,count]) =>({
      //   name,
      //   label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
      //   count: `${count} active repos`
      // }) ).sort((a,b)=> parseInt(b.count) - parseInt(a.count))
      // .slice(0,15) // top 15 trending topics

      return await Tag.find({}).select("name description color -_id").lean();
    
    }, 3600)

    const topicMap = new Map();

    // curated topics take priority 
    dbTags.forEach(tag => {
      topicMap.set(tag.name, {
        name:tag.name,
        label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1).replace(/-/g, ' '),
        color:tag.color
      });
    });

    //overwrite with curated topics
    curatedTopics.forEach(topic=> topicMap.set(topic.name, topic));

    res.status(StatusCodes.OK).json({
      status: "success",
      data: Array.from(topicMap.values()),
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:"error",
      message: error.message
    })
  }
}

// @desc saving custom tag
// @route POST /api/repos/topics
export const createTag = async (req,res)=> {
  try {
    const {name, description, color} = req.body;

    const formattedName = name.toLowerCase().trim().replace(/\s+/g, '-');

    const newTag = await Tag.create({
      name:formattedName,
      description,
      color: color || "#4f46e5",
      createdBy: req.user._id
    })

    // log global tag creation
    await createLog(
      req.user._id,
      null, 
      "created global tag",
      "tag", 
      newTag._id,
      `Added new topic: ${formattedName} to the discovery topics`
    )

    // invalidate cache
    await redisClient.del("explore:db_tags");

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: newTag
    });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tag already exists" });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

// @desc remove custom tag 
// @route DELETE /api/repos/topics/:id
export const deleteTag = async (req,res)=> {
  try {
    const {id} = req.params;
    const userId = req.user._id;

    // finding tag
    const tag = await Tag.findById(id);
    if(!tag) return res.status(StatusCodes.NOT_FOUND).json({
      status: "error",
      message: "Tag not found"
    })

    const name = tag.name;

    // only tag creator can delete his/her custom tag
    if(!tag.createdBy ||tag.createdBy.toString() !== userId.toString() ){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Unauthorized"

    });
  }
    await Tag.findByIdAndDelete(id);

    // invalidating cache
    await redisClient.del("explore:db_tags");

    res.status(StatusCodes.OK).json({ 
      status: "success", 
      message: `${name} tag removed successfully and cache cleared`
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: "error", 
      message: error.message 
    });
  }
};
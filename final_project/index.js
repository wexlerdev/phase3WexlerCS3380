import express from 'express';
import cors from 'cors';
import { fetchProjectsByTechnology, fetchAllProjects, showPostsRelatedToProject, showPostsWithGivenTag } from './functions.js';
const app = express()
import db from './database.js';
app.use(express.json())
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/projects', async (req, res) => {
    console.log("Request received for /projects endpoint");
    try {
        console.log("Fetching all projects...");
        const projects = await fetchAllProjects();
        console.log("Projects fetched:", projects);
        res.json(projects);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        res.status(500).send('An error occurred while fetching all projects');
    }
});

// Endpoint to create a new project
app.post('/projects', async (req, res) => {
    const { title, description, startDate, endDate } = req.body;
    
    if (!title || !startDate) { // Basic validation
        return res.status(400).send('Project title and start date are required');
    }

    try {
        const query = 'INSERT INTO PROJECT (title, description, startDate, endDate) VALUES (?, ?, ?, ?)';
        await db.query(query, [title, description, startDate, endDate]);
        res.status(201).send('Project created successfully');
    } catch (error) {
        console.error('Failed to create project:', error);
        res.status(500).send('An error occurred while creating the project');
    }
});




app.get('/projectsByTechnology/:technology', async (req, res) => {
    const { technology } = req.params; // Extract technology from URL parameters

    try {
        const projects = await fetchProjectsByTechnology(technology);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching projects by technology');
    }
});

app.get('/postsByProject/:projectID', async (req, res) => {
    try {
        const projectID = parseInt(req.params.projectID);
        const posts = await showPostsRelatedToProject(projectID);
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/postsByTag/:tagID', async (req, res) => {
    try {
        const tagID = parseInt(req.params.tagID);
        const posts = await showPostsWithGivenTag(tagID);
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
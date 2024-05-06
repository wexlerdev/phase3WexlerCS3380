import db from './database.js';

export async function fetchProjectsByTechnology(technology) {
    try {
        const query = `
            SELECT p.projectID, p.title, p.description, t.technology
            FROM PROJECT p
            JOIN TECHNOLOGIES t ON p.projectID = t.projectID
            WHERE t.technology = ?
        `;
        const results = await db.query(query, [technology]);
        return results[0].map(row => ({
            projectId: row.projectID,
            title: row.title,
            description: row.description,
            technology: row.technology
        }));
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; // rethrow or handle error as necessary
    }
}

export async function fetchAllProjects() {
    try {
        const query = 'SELECT * FROM PROJECT';
        const results = await db.query(query);
        console.log("Results:", results);
        return results[0].map(row => ({
            projectId: row.projectID,
            title: row.title,
            description: row.description,
            startDate: row.startDate,
            endDate: row.endDate
        }));
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; // rethrow or handle error as necessary
    }
}

export async function showPostsRelatedToProject(projectID) {
    try {
        // Step 1: Validate the ProjectID
        const validationQuery = 'SELECT COUNT(*) AS projectCount FROM PROJECT WHERE projectID = ?';
        const validationResults = await db.query(validationQuery, [projectID]);
        if (validationResults[0].projectCount === 0) {
            throw new Error('No such project exists');
        }

        const query = `
            SELECT p.postID, p.title, p.publishDate, p.featuredImage
            FROM POST p
            JOIN INCLUDED_IN i ON p.postID = i.postID
            WHERE i.projectID = ?
        `;
        const posts = await db.query(query, [projectID]);

        return posts[0].map(post => ({
            postId: post.postID,
            title: post.title,
            publishDate: post.publishDate,
            featuredImage: post.featuredImage,
            authorId: post.authorID
        }));
    } catch (error) {
        console.error("Error fetching posts related to project:", error);
        throw error;  // Rethrow the error or handle it appropriately
    }
}

export async function showPostsWithGivenTag(tagID) {
    try {
        // Step 1: Validate the tagID
        const validationQuery = 'SELECT COUNT(*) AS tagCount FROM TAG WHERE tagID = ?';
        const validationResults = await db.query(validationQuery, [tagID]);
        if (validationResults[0].tagCount === 0) {
            throw new Error('No such tag exists');
        }

        const query = `
            SELECT p.postID, p.title, p.publishDate, p.featuredImage
            FROM POST p
            JOIN TAGGED_WITH tw ON p.postID = tw.postID
            WHERE tw.tagID = ?
        `;
        const posts = await db.query(query, [tagID]);

        return posts[0].map(post => ({
            postId: post.postID,
            title: post.title,
            publishDate: post.publishDate,
            featuredImage: post.featuredImage,
        }));
    } catch (error) {
        console.error("Error fetching posts with given tag:", error);
        throw error;  // Rethrow the error or handle it appropriately
    }
}


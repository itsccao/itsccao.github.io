const fitRss = "https://www.fit.hcmus.edu.vn/vn/feed.aspx";
const rssUrl = `https://api.allorigins.win/raw?url=${fitRss}`;

const feedLocal = "fitLocal";
const feedLocalTime = "fitLocalTime";
const feedPosts = 10;
const feedIsFirstRun = "feedIsFirstRun";

const feedBoard = document.getElementById("hcmus-fit-new-post");

if (localStorage.getItem(feedIsFirstRun) == null)
{
    localStorage.setItem(feedIsFirstRun, "true");
}

async function fetchRecentPosts()
{
    try 
    {
        const response = await fetch(rssUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const items = xml.querySelectorAll("item");
        const posts = [];

        for (let i = 0;i < Math.min(feedPosts, items.length);++i)
        {
            const item = items[i];
            const title = item.querySelector("title")?.textContent ?? "No Title";
            const link = item.querySelector("link")?.textContent ?? "#";
            const pubDate = item.querySelector("pubDate")?.textContent ?? "No Date";

            posts.push({title, link, pubDate});
        }

        console.log("Recent Posts: ", posts);
        return posts;
    }
    catch (error)
    {
        console.error("Failed to fetch RSS feed: ", error);
        return [];
    }
}

function feedGetLocal()
{
    try
    {
        const stored = localStorage.getItem(feedLocal);
        return stored ? JSON.parse(stored) : [];
    }
    catch (error)
    {
        console.error("Error reading from localStorage: ", error);
        return [];
    }
}

function feedSaveLocal(posts)
{
    try
    {
        localStorage.setItem(feedLocal, JSON.stringify(posts));
        localStorage.setItem(feedLocalTime, new Date().toISOString());
    }
    catch (error)
    {
        console.error("Error saving to localStorage: ", error);
    }
}

function feedGetNewPosts(currentPosts, storedPosts)
{
    if (!storedPosts || storedPosts.length === 0)
    {
        return currentPosts;
    }
    
    const newPosts = [];
    for (const currentPost of currentPosts)
    {
        const isNew = !storedPosts.some(storedPost => 
            storedPost.title === currentPost.title && 
            storedPost.link === currentPost.link
        );
        if (isNew)
        {
            newPosts.push(currentPost);
        }
    }
    return newPosts;
}

function feedCreatePost(post)
{
    const container = document.createElement("div");
    container.className = "page-list";

    const linkText = document.createElement("text");
    const link = document.createElement("a");
    link.className = "page-list-link";
    link.href = post.link;
    link.textContent = post.title;
    linkText.appendChild(link);

    const dateText = document.createElement("text");
    dateText.textContent = post.pubDate;

    container.appendChild(linkText);
    container.appendChild(document.createElement("br"));
    container.appendChild(dateText);

    return container;
}

function feedRenderPosts(posts)
{
    const wrapper = document.querySelector(".page-list-container");
    wrapper.innerHTML = "";

    for (const post of posts)
    {
        const postElement = feedCreatePost(post);
        wrapper.appendChild(postElement);
    }
}

async function feedDoTheJob()
{
    console.log("Doing The Job");
    const storedPosts = feedGetLocal();
    feedRenderPosts(storedPosts);

    const currentPosts = await fetchRecentPosts();
    const newPosts = feedGetNewPosts(currentPosts, storedPosts);

    if (newPosts.length > 0)
    {
        const updatedPosts = [...newPosts, ...storedPosts];
        if (updatedPosts.length > feedPosts)
        {
            updatedPosts.splice(feedPosts);
            console.log("Updated Posts: ", updatedPosts);
        }
        feedSaveLocal(updatedPosts);
        feedRenderPosts(updatedPosts);
        feedBoard.innerText = newPosts.length;
    }
}

const storedPosts = feedGetLocal();
feedRenderPosts(storedPosts);

const feedCurrentTime = new Date().toISOString();
const feedLastTime = localStorage.getItem(feedLocalTime);
if (feedCurrentTime - feedLastTime > 1000 * 60 * 60 * 24 || localStorage.getItem(feedIsFirstRun) == "true")
{
    feedDoTheJob();
    localStorage.setItem(feedIsFirstRun, "false");
}
else
{
    console.log("Not doing the job");
}
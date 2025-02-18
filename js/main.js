function createElemWithText(elementType = "p", textContent = "", className) {
    const newElement = document.createElement(elementType);
    newElement.textContent = textContent;
    if (className) {
        newElement.classList.add(className);
    }
    return newElement;
}

function createOption(value, text) {
    let option = createElemWithText("option", text);
    option.value = value;
    return option;
}

function createSelectOptions(users) {
    if (!users) {
        return;
    }
    return users.map(user => createOption(user.id, user.name))
}

function toggleCommentSection(postId) {
    if (!postId) {
        return;
    }
    let section = document.querySelector("section[data-post-id='"+postId+"'] ");
    if (section) {
        section.classList.toggle("hide");
    }
    return section;
}

function toggleCommentButton(postId) {
    if (!postId) {
        return;
    }
    let button = document.querySelector("button[data-post-id='"+postId+"'] ");
    if (!button) {
        return null;
    }
    button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments"
    return button;
}

function deleteChildElements(parentElement) {
    if (!parentElement || !(parentElement instanceof Element)) {
        return undefined;
    }
    let childElement = parentElement.lastElementChild;
    while (childElement) {
        parentElement.removeChild(childElement)
        childElement = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {
    let buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        button.addEventListener("click",(event) => toggleComments(event, postId))
    })
    return buttons;
}

function removeButtonListeners() {
    let buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        button.removeEventListener("click",(event) => toggleComments(event, postId))
    })
    return buttons;
}

function createCommentBlock(comment) {
    let article = document.createElement("article");
    let h3 = createElemWithText("h3", comment.name);
    let p1 = createElemWithText("p", comment.body);
    let p2 = createElemWithText("p", `From: ${comment.email}`);
    article.append(h3, p1, p2);
    return article;
}

function createComments(comments) {
    if (!comments) {
        return;
    }
    let commentList = document.createDocumentFragment();
    comments.forEach(comment => {
        let article = createCommentBlock(comment);
        commentList.appendChild(article);
    })
    return commentList;
}

function populateSelectMenu(selectOptions) {
    if (!selectOptions) {
        return;
    }
    const selectMenu = document.querySelector("#selectMenu");
    selectMenu.append(...createSelectOptions(selectOptions));
    return selectMenu;
}

async function getUsers() {
    try {
        let users = await fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json());
        return users;
    } catch(error) {
        console.error("Error getting Users")
    }
}

async function getUserPosts(userId) {
    if (!userId) {
        return;
    }
    try {
        let posts = await fetch("https://jsonplaceholder.typicode.com/users/"+userId+"/posts")
        .then(response => response.json());
        return posts;
    } catch(error) {
        console.error("Error getting User Posts "+userId)
    }
}

async function getUser(userId) {
    if (!userId) {
        return;
    }
    try {
        let user = await fetch("https://jsonplaceholder.typicode.com/users/"+userId)
        .then(response => response.json());
        return user;
    } catch(error) {
        console.error("Error getting User"+userId)
    }
}

async function getPostComments(postId) {
    if (!postId) {
        return;
    }    
    try {
        let postComments = await fetch("https://jsonplaceholder.typicode.com/posts/"+postId+"/comments")
        .then(response => response.json());
        return postComments;
    } catch(error) {
        console.error("Error getting Post Comments "+postId)
    }
}

async function displayComments(postId) {
    if (!postId) {
        return;
    }
    let section = document.createElement('section');
    section.setAttribute("data-post-id", postId);
    section.classList.add('comments','hide');
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}

async function createPosts(posts) {
    if (!posts) {
        return;
    }
    let fragment = document.createDocumentFragment();
    for (let i=0; i < posts.length; i++) {
        post = posts[i];
        let article = document.createElement('article');
        const h2 = createElemWithText('h2',post.title);
        const p = createElemWithText('p',post.body);
        const postp = createElemWithText('p',`Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorp = createElemWithText('p',`Author: ${author.name} with ${author.company.name}`)
        const catchphrase = createElemWithText('p',author.company.catchPhrase);
        let button = createElemWithText('button','Show Comments');
        button.dataset.id = post.id;
        button.setAttribute("data-post-id", post.id);
        article.append(h2,p,postp,authorp,catchphrase,button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.appendChild(article);
    }
    return fragment;
}

async function displayPosts(posts) {
    const main = document.querySelector("main");
    const element = (posts) ? await createPosts(posts) : createElemWithText("p","Select an Employee to display their posts.","default-text");
    main.append(element);
    return element;
}

function toggleComments(event, postId) {
    if (!event || !postId) {
        return;
    }
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [ section, button ];
}

async function refreshPosts(posts) {
    if (!posts) {
        return;
    }
    const buttons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const postsFragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [buttons, main, postsFragment, addButtons ]
}

async function selectMenuChangeEventHandler(event) {
    let userId = event?.target?.value || 1;
    const posts  = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

async function initApp() {
    initPage();
    const select = document.getElementById("selectMenu");
    select.addEventListener("change",selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded",initApp);
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
    let section = document.getElementById("#"+postId);
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
        button.addEventListener("click",toggleComments)
    })
    return buttons;
}

function removeButtonListeners() {
    let buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        button.removeEventListener("click",toggleComments)
    })
    return buttons;
}

function createComments(comments) {
    if (!comments) {
        return;
    }
    let commentList = document.createDocumentFragment()
    comments.forEach(comment => {
        let article = document.createElement("article");
        let h3 = createElemWithText("h3",comment.name);
        let p1 = createElemWithText("p",comment.body);
        let p2 = createElemWithText("p",`From: ${comment.email}`);
        article.append(h3,p1,p2);
        commentList.append(article);
    })
    return commentList;
}

function populateSelectMenu(selectOptions) {
    if (!selectOptions) {
        return;
    }
    const selectMenu = document.querySelector("#selectMenu");
    const options = createSelectOptions(selectOptions);
    options.forEach(option => {
        selectMenu.append(options); // TODO: try spread here
    });
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

function toggleComments() {

}
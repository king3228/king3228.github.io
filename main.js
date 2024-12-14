const API_URL = 'https://jsonplaceholder.typicode.com';

export const getAllPosts = async () => {
    const response = await fetch(`${API_URL}/posts`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const createPost = async (post) => {
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const updatePostById = async (id, post) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const deletePostById = async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });

    if (!response.ok) {
        throw new Error('Error deleting post');
    }

    return { message: 'Post deleted successfully' };
};

export const getPostById = async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

let currentPage = 1;
const postsPerPage = 5;

const renderPosts = (posts) => {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '';

    const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    paginatedPosts.forEach((post) => {
        const listItem = document.createElement('li');
        listItem.classList.add('post-item');
        listItem.textContent = post.title;
        postsList.appendChild(listItem);

        listItem.addEventListener('click', () => showPostDetails(post.id));
    });

    const paginationButtons = document.createElement('div');
    paginationButtons.innerHTML = `
        <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage}</span>
        <button id="next-page" ${currentPage * postsPerPage >= posts.length ? 'disabled' : ''}>Next</button>
    `;
    postsList.appendChild(paginationButtons);

    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
};

const changePage = (direction) => {
    currentPage += direction;
    loadPosts();
};

const showPostDetails = async (id) => {
    const postDetails = document.getElementById('post-details');
    const post = await getPostById(id);
    postDetails.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
};

const loadPosts = async () => {
    try {
        const posts = await getAllPosts();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const createPostHandler = async (event) => {
    event.preventDefault();
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const newPost = { title, body };

    try {
        const createdPost = await createPost(newPost);
        alert('Post created successfully!');
        loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
    }
};

const updatePostHandler = async (event) => {
    event.preventDefault();
    const id = document.getElementById('update-post-id').value;
    const title = document.getElementById('update-post-title').value;
    const body = document.getElementById('update-post-body').value;
    const updatedPost = { title, body };

    try {
        const updated = await updatePostById(id, updatedPost);
        alert('Post updated successfully!');
        loadPosts();
    } catch (error) {
        console.error('Error updating post:', error);
    }
};

const deletePostHandler = async () => {
    const id = document.getElementById('delete-post-id').value;

    try {
        const response = await deletePostById(id);
        alert(response.message);
        loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

const getPostByIdHandler = async (event) => {
    event.preventDefault();
    const id = document.getElementById('get-post-id').value;

    try {
        const post = await getPostById(id);
        const singlePostDetails = document.getElementById('single-post-details');
        singlePostDetails.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
    } catch (error) {
        console.error('Error fetching post:', error);
    }
};

document.getElementById('create-post-form').addEventListener('submit', createPostHandler);
document.getElementById('update-post-form').addEventListener('submit', updatePostHandler);
document.getElementById('delete-post-btn').addEventListener('click', deletePostHandler);
document.getElementById('get-post-by-id-form').addEventListener('submit', getPostByIdHandler);

loadPosts();

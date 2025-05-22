// ===========================================
// 1. Global State
// ===========================================
let posts = []; // Initializes empty array to store post objects
let editingPostId = null; // Variable to hold ID of the post being edited, or null if no post is being edited.

// ===========================================
// 2. DOM Element References
// ===========================================
const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const titleError = document.getElementById("titleError");
const contentError = document.getElementById("contentError");
const postsContainer = document.getElementById("postsContainer");
const toggleFormBtn = document.getElementById("toggleFormBtn");
const formSection = document.getElementById("formSection");

// ===========================================
// 3. Utility Functions
// ===========================================
function generateId() {
  // Generates a unique ID for a new post using the current timestamp
  return Date.now().toString();
}

function formatTimestamp(timestamp) {
  // Formats a given timestamp into a human-readable date and time string
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function savePostsToStorage() {
  // Saves the current 'posts' array to the browser's local storage after converting it to a JSON string
  localStorage.setItem("posts", JSON.stringify(posts));
}

function loadPostsFromStorage() {
  /* 
  Loads posts from local storage. If posts exist, it parses the JSON string back into an array; 
  Otherwise, it initializes an empty array
  */
  const stored = localStorage.getItem("posts");
  posts = stored ? JSON.parse : [];
}

function clearForm() {
  // Clears the input fields of the post form and resets the "editingPostId"
  titleInput.value = "";
  contentInput.value = "";
  editingPostId = null;
}

// ===========================================
// 4. Render Function
// ===========================================
function renderPosts() {
  // Clears current content of the posts container to prepare for re-rendering
  postsContainer.innerHTML - "";

  // Iterates over each post in the 'posts' array
  posts.forEach((post) => {
    // Creates a new div element for each post
    const postDiv = document.createElement("div");
    // Assigns a CSS class for styling
    postDiv.className = "posts";

    // Generates the HTML for the creation timestamp
    const created = `<div class="post-timestamp"><em>Posted on: ${formatTimestamp(
      post.timestamp
    )}</em></div>`;
    // Checks if the post has been edited, if so, generates the HTML for the edited timestamp
    const edited = post.editedAt
      ? `<div class="post-timestamp"><em>Last edited: ${formatTimestamp(
          post.editedAt
        )}</em></div>`
      : // If post has not been edited, this will be an empty string
        "";
    // Sets the inner HTML of the post div, including the title, content, timestamps, and action buttons
    postDiv.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-content">${post.content}</div>
      ${created}
      ${edited}
      <div class="post-buttons">
        <button data-id="${post.id}" class="edit-btn">Edit</button>
        <button data-id="${post.id}" class="delete-btn">Delete</button>
      </div>
    `;
    // Appends the newly created post div to the posts container, making it visible on the page
    postsContainer.appendChild(postDiv);
  });
}

// ===========================================
// 5. Form Submit Handler
// ===========================================
postForm.addEventListener("submit", function (e) {
  // Prevents the default form submission, which would cause a page reload
  e.preventDefault();

  // Retrieves the trimmed values from the title and content input fields
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Initializes a 'valid' flag for form validation and clears previous error messages
  let valid = true;
  titleError.textContent = "";
  contentError.textContent = "";

  // Validates if the title input is empty, and If so, displays an error message and sets 'valid' to false
  if (!title) {
    titleError.textContent = "Title is required.";
    valid = false;
  }

  // Validates if the title input is empty, and If so, displays an error message and sets 'valid' to false
  if (!content) {
    contentError.textContent = "Content is required.";
    valid = false;
  }

  // If the form is not valid, stops the function execution
  if (!valid) return;
});

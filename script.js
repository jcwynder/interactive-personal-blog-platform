// ===========================================
// 1. Global State
// ===========================================

let posts = []; // Initializes an empty array to store post objects
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
  // FIX: Pass 'stored' to JSON.parse
  posts = stored ? JSON.parse(stored) : [];
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
  // FIX: Changed '-' to '='
  postsContainer.innerHTML = "";

  // Iterates over each post in the 'posts' array
  posts.forEach((post) => {
    // Creates a new div element for each post
    const postDiv = document.createElement("div");
    // Assigns a CSS class for styling (FIX: Changed "posts" to "post" for consistency)
    postDiv.className = "post";

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

  // Validates if the content input is empty, and If so, displays an error message and sets 'valid' to false
  if (!content) {
    contentError.textContent = "Content is required.";
    valid = false;
  }

  // If the form is not valid, stops the function execution
  if (!valid) return;

  // Checks if a post is currently being edited (i.e., 'editingPostId' has a value)
  if (editingPostId) {
    // If editing, finds the index of the post in the 'posts' array using its ID
    const postIndex = posts.findIndex((post) => post.id === editingPostId);
    // If the post is found, updates its title, content, and sets the "editedAt" timestamp
    if (postIndex > -1) {
      posts[postIndex].title = title;
      posts[postIndex].content = content;
      posts[postIndex].editedAt = new Date().toISOString();
    }
  } else {
    // If not editing, creates a new post object with a generated ID, title, content, and creation timestamp
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: new Date().toISOString(),
      // New posts initially have no "editedAt" timestamp
      editedAt: null,
    };
    // Adds the new post to the "posts" array
    posts.push(newPost);
  }

  // Saves the updated "posts" array to local storage
  savePostsToStorage();
  // Re-renders all posts on the page to reflect the changes
  renderPosts();
  // Clears the form fields and resets the "editingPostId"
  clearForm();
});

// ===========================================
// 6. Event Delegation for Edit/Delete
// ===========================================

postsContainer.addEventListener("click", function (e) {
  // Checks if the clicked element has the class "delete-btn"
  if (e.target.classList.contains("delete-btn")) {
    // Retrieves the ID of the post to be deleted from the button's data-id attribute
    const id = e.target.dataset.id;
    // Filters the "posts" array, keeping only posts whose IDs do not match the ID of the post to be deleted
    posts = posts.filter((post) => post.id !== id);
    // Saves the updated (post-deleted) array to local storage
    savePostsToStorage();
    // Re-renders the posts to update the display, removing the deleted post
    renderPosts();
  }

  // Checks if the clicked element has the class "edit-btn"
  if (e.target.classList.contains("edit-btn")) {
    // Retrieves the ID of the post to be edited from the button's data-id attribute
    const id = e.target.dataset.id;
    // Finds the post object in the "posts" array that matches the ID
    const post = posts.find((p) => p.id === id);
    // If the post is found:
    if (post) {
      // Populates the title and content input fields with the post's current data
      titleInput.value = post.title;
      contentInput.value = post.content;
      // Sets "editingPostId" to the ID of the post being edited
      editingPostId = id;

      // Checks if the form section is currently collapsed
      if (formSection.classList.contains("collapsed")) {
        // If collapsed, removes the "collapsed" class to make the form visible
        formSection.classList.remove("collapsed");
        // Changes the text of the toggle button to indicate it will now close the form
        toggleFormBtn.textContent = "× Close Form";
      }
    }
  }
});

// ===========================================
// 7. Toggle Form Visibility
// ===========================================

// Adds an event listener to the "toggleFormBtn" that triggers when it's clicked
toggleFormBtn.addEventListener("click", () => {
  // Toggles the "collapsed" class on the `formSection`. This will show or hide the form based on its current state
  formSection.classList.toggle("collapsed");

  // Checks if the "formSection" now has the "collapsed" class
  if (formSection.classList.contains("collapsed")) {
    // If it's collapsed, changes the button text to "+ New Post" to indicate it will expand the form
    toggleFormBtn.textContent = "+ New Post";
    // Optionally clears the form fields when the form is collapsed, resetting it for a new entry
    clearForm();
  } else {
    // If the form is not collapsed (meaning it's visible), changes the button text to "× Close Form"
    toggleFormBtn.textContent = "× Close Form";
  }
});

// ===========================================
// 8. Initialize App
// ===========================================

// Loads any previously saved posts from local storage into the "posts" array when the application starts
loadPostsFromStorage();
// Renders all loaded posts onto the page, displaying them to the user
renderPosts();

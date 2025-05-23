// ===========================================
// 1. Global State
// ===========================================

let posts = []; // Initializes an empty array to store post objects
let editingPostId = null; // Variable to hold ID of the post being edited, or null if no post is being edited
let currentSort = localStorage.getItem("sortPreference") || "newest"; // Sort preference

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
const sortSelect = document.getElementById("sortSelect");

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
  // Saves the current sort option to the browser's local storage
  localStorage.setItem("sortPreference", currentSort);
}

function loadPostsFromStorage() {
  // Loads posts from local storage
  const stored = localStorage.getItem("posts");
  /*
  If posts are found, it parses the JSON string back into an array
  Otherwise, it initializes an empty array
  */
  posts = stored ? JSON.parse(stored) : [];
}

function clearForm() {
  // Clears the input fields (as well as its error messages) of the post form and resets the "editingPostId"
  titleInput.value = "";
  contentInput.value = "";
  titleError.textContent = "";
  contentError.textContent = "";
  editingPostId = null;

  // Collapses the form after submission
  if (!formSection.classList.contains("collapsed")) {
    formSection.classList.add("collapsed");
    toggleFormBtn.textContent = "+ New Post";
  }
}

// ===========================================
// 4. Render Function
// ===========================================

function renderPosts() {
  // Clears current content of the posts container to prepare for re-rendering
  postsContainer.innerHTML = "";

  /* 
  Creates a shallow copy of the 'posts' array
  This allows sorting without modifying the the original 'posts' array directly
  */
  let sortedPosts = [...posts];

  // Checks the value of 'currentSort' to determine the sorting order
  if (currentSort === "newest") {
    /* 
    Sorts the 'sortedPosts' array by timestamp in descending order (newest first)
    It subtracts the earlier date from the later date; a positive result means 'b' is newer than 'a'.
    */
    sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (currentSort === "oldest") {
    /* 
    Sorts the 'sortedPosts' array by timestamp in ascending order (oldest first)
    It subtracts the later date from the earlier date; a positive result means 'a' is newer than 'b'.
    */
    sortedPosts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (currentSort === "title") {
    /* 
    Sorts the 'sortedPosts' array alphabetically by the 'title' property
    `localeCompare()` is used for proper string comparison, handling different locales and special characters correctly
    */
    sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
  }

  // If there are no posts:
  if (posts.length === 0) {
    // Empty state message displays
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "No blog posts yet. Click '+ New Post' to get started!";
    postsContainer.appendChild(emptyMessage);
    return;
  }

  // Iterates over each post in the 'posts' array
  sortedPosts.forEach((post) => {
    // Creates a new div element for each post
    const postDiv = document.createElement("div");
    // Assigns a CSS class for styling (FIX: Changed "posts" to "post" for consistency)
    postDiv.className = "post";

    // Generates the HTML for the creation timestamp
    const created = `<div class="post-timestamp"><em>Posted on: ${formatTimestamp(
      post.timestamp
    )}</em></div>`;
    // Checks if the post has been edited, and if so, generates the HTML for the edited timestamp
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

  // Validates if the title input is empty, and if so, displays an error message and sets 'valid' to false
  if (!title) {
    titleError.textContent = "Title is required.";
    valid = false;
  }

  // Validates if the content input is empty, and if so, displays an error message and sets 'valid' to false
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

    // Confirmation prompt before deleting
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

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

        // Scrolls to form input after "Edit" button is clicked
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
});

// ===========================================
// 7. Toggle Form Visibility
// ===========================================

// Adds an event listener to the "toggleFormBtn" that triggers when it's clicked
toggleFormBtn.addEventListener("click", () => {
  // Checks if the form section is currently visible (not collapsed)
  const isFormOpen = !formSection.classList.contains("collapsed");

  // Determines if there are any unsaved changes in the form inputs:
  const hasUnsavedChanges =
    titleInput.value.trim() !== "" || // Checks if title input has text
    contentInput.value.trim() !== "" || // Checks if content input has text
    editingPostId !== null; // Check if a post is currently being edited

  // If the form is open and there are unsaved changes
  if (isFormOpen && hasUnsavedChanges) {
    // Confirms with the user if they want to discard unsaved changes and close the form
    const confirmClose = confirm(
      "You have unsaved changes. Discard and close the form?"
    );
    // Stops function execution if user cancels
    if (!confirmClose) return;
  }

  // Toggle the 'collapsed' class on the form section to show/hide it
  formSection.classList.toggle("collapsed");

  // Update the text content of the toggle button based on the form's visibility
  toggleFormBtn.textContent = formSection.classList.contains("collapsed")
    ? "+ New Post" // If the form is collapsed, display "New Post"
    : "× Close Form"; // If the form is open, display "Close Form"

  // Clear the form only when it's being collapsed
  if (formSection.classList.contains("collapsed")) {
    // This includes resetting fields and editing state
    clearForm();
  } else {
    // Scrolls to form input after "New Post" button is clicked
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// ===========================================
// 8. Sort Select Change Handler
// ===========================================

// Sets the initial value of the sort dropdown to the currently active sort preference
sortSelect.value = currentSort;

// Adds an event listener to the sort dropdown that triggers whenever its selected value changes
sortSelect.addEventListener("change", (e) => {
  // Updates `currentSort` with the newly selected value from the dropdown
  currentSort = e.target.value;
  // Saves the user's new sorting preference to local storage so it persists across sessions
  localStorage.setItem("sortPreference", currentSort);
  // Re-renders the posts to display them according to the new sorting order
  renderPosts();
});

// ===========================================
// 9. Initialize App
// ===========================================

// Loads any previously saved posts from local storage into the "posts" array when the application starts
loadPostsFromStorage();
// Renders all loaded posts onto the page, displaying them to the user
renderPosts();

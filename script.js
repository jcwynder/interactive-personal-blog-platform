// ===========================================
// 1. Global State
// ===========================================
let posts = [];
let editingPostId = null;

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

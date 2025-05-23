# Interactive Personal Blog Platform

## Overview

For this assignment, I was tasked with building an **Interactive Personal Blog Platform** with the intended goals:

**Create New Posts**:

- A form with fields for a post title and post content (e.g., using `<input type="text"`> for title and `<textarea>` for content).
- Upon submission, the new post should be added to a list of posts displayed on the page.
- The form should be validated: both title and content are required.
- Display custom, user-friendly error messages if validation fails.

**Display Posts**:

- All created posts should be displayed on the page. Each displayed post should clearly show its title and content.
- Posts should be rendered dynamically using JavaScript.

**Edit Posts**:

- Each displayed post should have an “Edit” button.
- Clicking “Edit” should allow the user to modify the title and content of that specific post. This might involve populating the main form (or a modal form) with the existing post data.
- After editing, the updated post should be reflected in the display.
- Form validation should also apply during editing.

**Delete Posts**:

- Each displayed post should have a “Delete” button.
- Clicking “Delete” should remove the post from the display and from localStorage.

**Data Persistence with `localStorage`**:

- All blog posts (title, content, and perhaps a unique ID and timestamp you generate) must be saved in `localStorage`.
- When the page is loaded or refreshed, any posts previously saved in `localStorage` should be retrieved and displayed.
- Updates (from edits) and deletions must also be reflected in `localStorage`.

In order to create a dynamic and interactive form, I applied a wide range of concepts, including **DOM manipulation**, **event handling**, **JavaScript form validation**, and **utilizing local storage for data persistence**.

[Click Here to Access Interactive Personal Blog Platform](https://github.com/jcwynder/interactive-personal-blog-platform)

## Development

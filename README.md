# Todo Application

A modern, fully-featured Todo web application built with React + Vite that allows users to create, manage, and organize their tasks with image upload capabilities.


## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- npm, yarn, or pnpm

### **Quick Start**
```bash
# 1. Clone the repository
git clone https://github.com/rusma07/Optiverse-intern-task.git
cd Optiverse-intern-task

# 2. Install dependencies
npm install
# or
yarn install

# 3. Start development server
npm run dev
# or
yarn dev
```
Open the application in your browser:

http://localhost:5173
# Approach & Implementation
## 📋 Tech Stack
- **React 18** - Frontend library

- **Vite** - Build tool and dev server

- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

- **Lucide React** - Beautiful icons

- **LocalStorage** - Data persistence

## State Management

- React `useState` and `useEffect` hooks are used for local component state.
- Routing parameters (`useParams`) are used to load and edit specific todos.

## Data Handling

- A mock API layer simulates Axios using `localStorage`.
- CRUD operations (`get`, `post`, `put`, `delete`) read and write todos from `localStorage`.
- Each todo includes an `id`, `title`, `description`, `status`, `image`, and timestamp fields.

## Image Handling

- Images are selected via a file input and previewed using `URL.createObjectURL`.
- On save, images are converted to Base64 strings and stored in `localStorage`.
- This ensures images persist across page refreshes.

## UI / UX Decisions

- Loading and saving states provide clear user feedback during async actions.
- Validation prevents empty titles and invalid image uploads.
- Users can change, remove, or restore the original image when editing a todo.


## 🚀 Features
- [x] **Create Todos** with title, description, status, and image upload
- [x] **View Todo List** in a beautiful card layout 
- [x] **Edit Todos** - Update any todo field including replacing images
- [x] **Delete Tools** with confirmation dialog
- [x] **Toggle Status** - Mark todos as pending/completed
- [x] **Image Upload & Preview** - Upload and preview images before saving
- [x] **Responsive Design** - Works on desktop, tablet, and mobile
- [x] **Local Storage** - Data persists across browser sessions
- [x] **Modern UI** - Clean, professional interface with smooth animations

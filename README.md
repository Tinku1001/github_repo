# GitHub Repository Search

A full-stack web application that allows users to search GitHub repositories, save them to a personal collection, and manage their search history.

## Features

- Search GitHub repositories by keyword
- View repository details including stars, forks, language, and description
- Save repositories to personal collection
- Search history tracking
- Pagination for large result sets
- Responsive design
- Real-time search with debouncing

## Tech Stack

### Frontend
- React 18
- Vite
- Axios for API calls
- Lucide React for icons
- Modern CSS with animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Rate limiting
- Helmet for security
- Morgan for logging

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- GitHub Personal Access Token

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tinku1001/github_repo.git
cd your-repo-name

```


## Backend Setup
### cd server
```bash
npm install
npm run dev

```bash
### create env file
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/github-repo-search
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

GITHUB_TOKEN=ghp_your_github_personal_access_token
CORS_ORIGIN=http://localhost
```

### frontend Setup
 #### cd client
 ``` bash
 npm install
 ```

 ## create env file

 ```bash
 VITE_API_BASE_URL=http://localhost:5000/api
 VITE_APP_TITLE=GitHub Repository Search
 ```

 ```bash
 npm run dev
```


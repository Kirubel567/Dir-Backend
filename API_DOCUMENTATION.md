# Dir API Documentation

## Overviews

The Dir API is a comprehensive repository and user management system that provides endpoints for authentication, user profile management, and repository operations.

## Base URL

```
http://localhost:5000
```
*(Or your deployed URL)*

## Authentication

The API uses **GitHub OAuth** via Passport.js for authentication.

### Authentication Flow
1. **GitHub Login**: Client redirects user to `/auth/github`.
2. **Callback**: GitHub redirects back to `/auth/github/callback`, setting a session cookie (`dir.sid`).
3. **Session**: Subsequent requests must include the `dir.sid` cookie (automatically handled by browsers).
4. **Logout**: Call `/auth/logout` to destroy the session.

---

## API Endpoints

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/auth/github** | Initiates GitHub OAuth login flow. Scopes: `user:email`, `read:user`, `repo`, `workflow`, `delete_repo`. | |
| `GET` | **/auth/github/callback** | Callback URL that handles the OAuth response and establishes the session. | |
| `POST` | **/auth/logout** | Destroys the user session and logs out. | |

#### POST `/auth/logout` Response
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### 👤 User (`/api`)
*Mounted at `/api`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/me** | Get current authenticated user's profile info. | ✅ Yes |
| `PATCH` | **/api/profile** | Update user profile fields. | ✅ Yes |
| `GET` | **/api/stats** | Get user statistics (repo counts, activity). | ✅ Yes |

#### GET `/api/me` Response
```json
{
  "status": "success",
  "data": {
    "_id": "60d5f9f8f4f3c72d8c8b4567",
    "githubId": "12345678",
    "githubUsername": "octocat",
    "email": "octocat@github.com",
    "avatarUrl": "https://avatars.githubusercontent.com/u/12345678?v=4",
    "profileUrl": "https://github.com/octocat",
    "bio": "I love coding",
    "role": "user",
    "isActive": true,
    "lastLogin": "2024-01-01T12:00:00.000Z",
    "preferences": {
      "notificationsEnabled": true,
      "emailNotifications": false,
      "theme": "system"
    },
    "reposOwned": [],
    "notifications": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### PATCH `/api/profile` Response
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "_id": "60d5f9f8f4f3c72d8c8b4567",
    "bio": "New bio updated via API",
    "preferences": {
       "theme": "dark"
    }
  }
}
```

#### GET `/api/stats` Response
```json
{
  "status": "success",
  "data": {
    "activeWorkspacesCount": 5,
    "unreadNotifications": 2,
    "githubTotalCount": 42,
    "totalTasks": 0,
    "role": "user"
  }
}
```

---

### 📂 Repositories (`/api/repos`)
*Mounted at `/api/repos`*

#### Discovery & Operations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/discovery** | List authenticated user's GitHub repositories available for import. | ✅ Yes |
| `POST` | **/api/repos/import** | Import a repository into the workspace. | ✅ Yes |
| `POST` | **/api/repos/create-workspace** | Create a new workspace from an existing GitHub repo. | ✅ Yes |
| `POST` | **/api/repos/create-remote** | Create a new GitHub repo and auto-import it. | ✅ Yes |
| `GET` | **/api/repos/contents** | List files/folders in a repo or workspace. | ✅ Yes |

#### GET `/api/repos/discovery` Response
```json
{
  "status": "success",
  "totalInGithub": 15,
  "data": [
    {
      "githubId": "12345678",
      "githubRepoName": "awesome-project",
      "githubOwner": "octocat",
      "githubFullName": "octocat/awesome-project",
      "workspaceName": "awesome-project",
      "isImported": false,
      "description": "My awesome project",
      "url": "https://github.com/octocat/awesome-project",
      "language": "JavaScript"
    }
  ]
}
```

#### POST `/api/repos/import` Request Body
```json
{
  "githubId": "12345678",
  "githubRepoName": "awesome-project",
  "githubOwner": "octocat",
  "githubFullName": "octocat/awesome-project",
  "workspaceName": "Project Alpha",
  "description": "My awesome project",
  "url": "https://github.com/octocat/awesome-project",
  "language": "JavaScript"
}
```

#### POST `/api/repos/import` Response
```json
{
  "status": "success",
  "data": {
    "_id": "60d5fa...",
    "githubId": "12345678",
    "githubRepoName": "awesome-project",
    "workspaceName": "Project Alpha",
    "ownerId": "60d5f9...",
    "members": [{ "userId": "...", "role": "owner" }],
    "channels": [{ "name": "general", "channel_id": "..." }],
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### POST `/api/repos/create-workspace` Request Body
```json
{
  "githubRepoName": "existing-repo",
  "workspaceName": "My New Workspace",
  "description": "Optional description"
}
```

#### POST `/api/repos/create-remote` Request Body
```json
{
  "name": "new-repo-name",
  "description": "My new project",
  "isPrivate": "private", // "private" or "public"
  "auto_init": "Yes",
  "gitignore_template": "Node"
}
```

#### GET `/api/repos/contents`
Query Parameters:
- `workspaceId`: (Optional) ID of the Dir workspace.
- `owner` & `repo`: (Optional) If workspaceId is not provided, specify GitHub owner and repo name.
- `path`: (Optional) Directory path to list (defaults to root).

Response (Directory):
```json
{
  "status": "success",
  "type": "dir",
  "data": [
    {
      "name": "src",
      "path": "src",
      "type": "dir",
      "sha": "...",
      "url": "..."
    },
    {
      "name": "README.md",
      "path": "README.md",
      "type": "file",
      "sha": "..."
    }
  ]
}
```

#### Management (CRUD)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/** | Get all active workspaces/repositories for the user. | ✅ Yes |
| `GET` | **/api/repos/:id** | Get details of a specific repository. | ✅ Yes |
| `PATCH` | **/api/repos/:id** | Update repository details (workspaceName, description). | ✅ Yes |
| `DELETE` | **/api/repos/:id** | Delete a repository from Dir (not GitHub). | ✅ Yes |

#### GET `/api/repos/` Response
```json
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "_id": "60d5fa...",
      "githubId": "12345678",
      "githubRepoName": "awesome-project",
      "workspaceName": "Project Alpha",
      "description": "My awesome project",
      "ownerId": "60d5f9...",
      "members": [ ... ]
    }
  ]
}
```

#### Sync & Tags
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | **/api/repos/:id/sync** | Manually sync repository with GitHub. | ✅ Yes |
| `POST` | **/api/repos/:id/tags** | Add tags to a repository. | ✅ Yes |
| `GET` | **/api/repos/topics** | Get popular topics/tags. | ✅ Yes |
| `POST` | **/api/repos/topics** | Create a new tag. | ✅ Yes |
| `DELETE` | **/api/repos/topics/:id** | Delete a tag. | ✅ Yes |

#### POST `/api/repos/:id/sync` Response
```json
{
  "status": "success",
  "message": "Synced with GitHub"
}
```

#### POST `/api/repos/:id/tags` Request Body
```json
{
  "tag": "favorites"
}
```

#### Activity
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/repos/:id/activity** | Get activity logs for a specific repository. | ✅ Yes |

#### GET `/api/repos/:id/activity` Response
```json
{
  "status": "success",
  "data": [
    {
      "id": "65e...",
      "user": "octocat",
      "action": "synchronized",
      "targetName": "awesome-project",
      "targetType": "repository",
      "message": "Updated metadata and languages from GitHub",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "iconType": "repository"
    }
  ]
}
```

---


---

### 📊 Activity (`/api/activity`)
*Mounted at `/api/activity`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/activity/feed** | Get global activity feed for the user (across all repos). | ✅ Yes |
| `GET` | **/api/activity/heatmap** | Get contribution heatmap data (daily counts). | ✅ Yes |
| `DELETE` | **/api/activity/logs** | Clear all activity history for the user. | ✅ Yes |

#### GET `/api/activity/feed` Response
```json
{
  "status": "success",
  "data": [
    {
      "id": "65e...",
      "user": "octocat",
      "action": "imported repository",
      "targetName": "awesome-project",
      "targetType": "repository",
      "message": "Initialized workspace for awesome-project",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "iconType": "repository"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "hasNextPage": false,
    "totalPages": 1
  }
}
```

#### GET `/api/activity/heatmap` Response
```json
{
  "status": "success",
  "data": [
    {
      "_id": "2023-12-31",
      "count": 5
    },
    {
      "_id": "2024-01-01",
      "count": 12
    }
  ]
}
```

---

## ⚠️ Notes
- **Empty Routes**: The following route modules exist but currently have no endpoints:
    - `/api/channels` (Channels)
    - `/api/memberships` (Memberships)
    - `/api/messages` (Messages)
    - `/api/notifications` (Notifications)

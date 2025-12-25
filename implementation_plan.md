# Implementation Plan - Migrate to Passport.js

## Objective
Replace `better-auth` with `passport.js` (GitHub Strategy) while preserving folder structure and user schema.

## Steps

### 1. Dependencies
- **Uninstall**: `better-auth`
- **Install**: 
  - `passport`
  - `passport-github2`
  - `express-session`
  - `connect-mongo`

### 2. Configuration (`src/config/passport.js`)
- Create new file `src/config/passport.js`.
- Configure `GitHubStrategy`:
  - Use `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
  - Callback URL: `/api/auth/github/callback`.
- **User Creation/Lookup**:
  - Strategy callback will look up user by `gitHubID` or `githubUserName`.
  - If user does not exist, create new user:
    - Generate `_id` using `crypto.randomUUID()` to match `String` type in schema.
    - Map fields: `githubUserName`, `gitHubID`, `name`, `email`, `image`.
- Implement `serializeUser` (store `user.id`).
- Implement `deserializeUser` (lookup by `id`).

### 3. Cleanup
- Delete `src/config/betterAuth.js`.

### 4. Application Setup (`src/app.js`)
- Initialize `express-session` with `MongoStore` using `MONGO_URI`.
- Initialize `passport`.
- **Routes**:
  - Remove `app.all("/api/auth/*path", ...)`
  - Add `GET /api/auth/github`
  - Add `GET /api/auth/github/callback`
  - Add `POST /api/auth/logout`

### 5. Middleware (`src/middlewares/auth.middleware.js`)
- Update `authMiddleware` to check `req.isAuthenticated()`.
- Ensure `req.user` is available (Passport does this automatically).

## Verification
- Start server with `npm run dev`.
- Check if server starts successfully.
- Code review to ensure all `better-auth` references are removed.

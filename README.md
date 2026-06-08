# Notification System Assessment

This repository contains the complete assessment solution for the Notification System.

## Project Structure
- `notification_app_fe`: React/Vite Frontend Application 
- `priority-inbox`: TypeScript solution for Priority Ranking
- `notification_app_be`: Node.js Backend API 
- `logging_middleware`: Express logging middleware

## How to Run the Frontend

1. Ensure your `.env` file is present in the root directory and contains your `ACCESS_TOKEN`:
   ```env
   ACCESS_TOKEN=your_token_here
   ```

2. Navigate to the frontend directory:
   ```bash
   cd notification_app_fe
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server (configured to run on port 3001 to avoid conflicts):
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3001`

## Screenshots

*(Save your screenshot images in a `screenshots` folder and replace the placeholders below)*

### All Notifications
![All Notifications](./screenshots/all-notifications.png)

### Filtered Notifications
![Filtered Notifications](./screenshots/filtered-notifications.png)

### Priority Inbox
![Priority Inbox](./screenshots/priority-inbox.png)

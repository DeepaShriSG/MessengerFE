ChatApp Frontend
Overview
ChatApp is a real-time chat application that allows users to communicate instantly. This repository contains the frontend code for the ChatApp.

Features
Real-time messaging
User authentication
Conversation management
Notifications for new messages
Key Functions
1. User Management
Socket Connection: Establishes a WebSocket connection to the server using Socket.IO.
Active Users: Listens for the getUsers event to update the list of active users.
2. Conversation Management
Fetch Conversations: Retrieves the list of conversations for the logged-in user from the backend.
Start Conversation: Initializes a new conversation between users. Sends an initial message if no previous conversation exists.
3. Message Handling
Send Message: Emits a sendMessage event via WebSocket and posts the message to the backend. Updates the message list upon success.
Fetch Messages: Retrieves messages for a specific conversation from the backend and updates the state.
Getting Started
Prerequisites
Make sure you have the following installed:

Node.js (version >=14.0.0)
npm or yarn
Installation
Clone the repository:


Acknowledgments
React
Axios
Socket.IO
Example of Functions in the README
Here's a detailed description of your chat app's functions:

Socket Connection
Description: Connects to the WebSocket server to receive and send real-time updates.
Usage: Automatically established when the component mounts and closed when it unmounts.
Active Users
Event: getUsers
Description: Receives a list of active users from the server and updates the UI.
How to Use: Displayed in the sidebar as "Active Users."
Conversations
Fetch Conversations
Description: Retrieves the list of conversations for the logged-in user.
Endpoint: GET /user/getconvo/:userId
Start Conversation
Description: Creates a new conversation or retrieves an existing one.
Endpoint: POST /user/startconvo
Initial Message: Sends a greeting if no prior conversation exists.
Messages
Send Message
Description: Sends a message to the current receiver via WebSocket and updates the server.
Endpoint: POST /user/sendMessage
Fetch Messages
Description: Retrieves messages for a specific conversation.
Endpoint: GET /user/getMessage/:conversationId


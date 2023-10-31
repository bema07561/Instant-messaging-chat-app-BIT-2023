

# Giggle Chat App

Giggle is a real-time chat application built with Node.js and Socket.IO that allows users to communicate with each other in both general and private chatrooms.


## Features

- Real-time messaging.
- Private messaging between users.
- Display of online users.
Let's go over how the main features of your Giggle Chat App work:


## Private Real-Time Messaging

**How it works:**
1. Users enter their desired username on the login 
page.

2. Upon clicking Enter they are directed to the  chat page.

3. The app displays a list of online users in the left column.

4. Users can click on an online user's name to initiate a private chat.

5. Users can type messages in the input box at the bottom of the chat area and press Enter to send them.

6. The private chat messages are sent only between the two involved users using their unique Socket.IO room.

7. The private chat messages are displayed in a separate chat area on both users' screens.

## Display of Online Users

**How it works:**
1. The server keeps track of users currently connected to the chat.

2. When a user joins the application, their username is added to the list of online users.

3. When a user disconnects, their username is removed from the list.

4. The list of online users is updated in real-time for all users using Socket.IO.

5. The online users list is displayed in a designated area on the chat page.



## Getting Started

1. **Clone the Repository**

    Clone the repository to your local machine:

    ```
    git clone https://github.com/noincent/im_app.git
    ```

2. **Install Dependencies**

    Navigate to the project directory and install the required dependencies:

    ```
    cd im_app
    npm install
    ```

3. **Run the Application**

    Start the Node.js server to run the application:

    ```
    node index.js
    ```

    The application will be accessible at `http://localhost:4000`.

4. **Usage**

    - Open your web browser and navigate to `http://localhost:4000`.
    - Enter a unique username and click Enter to enter the chatroom.
    - In private chat, you can select a user from the online users list to initiate a private conversation.

## Dependencies

- Node.js
- Express.js
- Socket.IO

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


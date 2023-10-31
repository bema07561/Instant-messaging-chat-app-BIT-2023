// $(function() {
    var win = $(window);
    var usernameInput = $('.username_input'); // Input for username
    var messages = $('.messages'); // Messages area
    var inputMessage = $('.input_message'); // Input message input box
    var loginPage = $('.login.page'); // The login page
    var chatPage = $('.chat.page'); // The chatroom page
    var username;
    var connected = false;
    var typing = false;
    var currentInput = usernameInput.focus();
    var socket = io();
    //
    var onlineUsersList = $('#online-users');
    var chatroomSelect = $('.chatroom-select');
    var currentChatroom = 'general'; // Default chatroom



    var publicmsgList = [];
    var privatemsgList = [];
    

    function clearChatArea() {
        $('.messages').empty();
    }
    

    const log = (message, options) => {
        var el = $('<li>').addClass('log').text(message);
        addMessageElement(el, options);
    }

    const setUsername = () => {
        username = cleanInput(usernameInput.val().trim());
        if (username) {
            socket.emit('check_username', username);
        }
    }

    socket.on('username_available', () => {
        loginPage.fadeOut();
        chatPage.show();
        loginPage.off('click');
        currentInput = inputMessage.focus();
        socket.emit('user_added', username);
        alert('Username is unique, you can proceed to chat!');
    
    });

    socket.on('username_taken', () => {
        alert('Username is already in use. Please choose a different username.');
        usernameInput.val('');
        usernameInput[0].focus();
        username = cleanInput(usernameInput.val().trim());
        if (username) {
            socket.emit('check_username', username);
        }
    });
    
    function getRandomImage() {
        var imageUrls = [
            "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?auto=format&fit=crop&w=1350&q=80",
            "https://images.unsplash.com/photo-1469050624972-f03b8678e363?auto=format&fit=crop&w=1350&q=80",
            "https://images.unsplash.com/photo-1502901930015-158e72cff877?auto=format&fit=crop&w=1350&q=80",
            "https://images.unsplash.com/photo-1501813722636-45de2fe4f9b4?auto=format&fit=crop&w=1350&q=80",
            'https://images.unsplash.com/photo-1511029029301-60680e65f7c7?auto=format&fit=crop&w=634&q=80',
            'https://images.unsplash.com/photo-1417577097439-425fb7dec05e?auto=format&fit=crop&w=1489&q=80']

        var randomIndex = Math.floor(Math.random() * imageUrls.length);
        return imageUrls[randomIndex];
    }
    
    socket.on('update_online_users', (users) => {
        onlineUsersList.empty();
        users.forEach((user) => {
            var discussionDiv = $('<div class="discussion">');
            
            var imageUrl = getRandomImage();
            var photoDiv = $('<div class="photo">').css('background-image', 'url(' + imageUrl + ')');
            photoDiv.append($('<div class="online">'));
            discussionDiv.append(photoDiv);
            
            var descContactDiv = $('<div class="desc-contact">');
            var nameParagraph = $('<p class="name">').text(user);
            descContactDiv.append(nameParagraph);
            discussionDiv.append(descContactDiv);
            
            var timerDiv = $('<div class="timer">').text('0 sec'); // Assuming default timer value
            discussionDiv.append(timerDiv);
            
            onlineUsersList.append(discussionDiv);
        });
    });
    

        // Listen for a user clicking on an online user's name
    onlineUsersList.on('click', 'div', function(e) {
        var recipient = e.target.innerText;
        if (recipient != username) { // Don't allow messaging yourself
            var message = prompt('Enter your private message:');
            if (message) {
                // Emit a private_chat event to the server
                socket.emit('private_chat', {
                    recipient: recipient,
                    message: message
                });
                console.log("PRIVATE: ",{
                    recipient: recipient,
                    message: message
                } )
            }
            console.log("SWITCHED CHAT to "+recipient);
            currentChatroom = recipient;
        }
    });

    socket.on('private_message', ({ sender, message }) => {
        // Display the private message in the chat area
        var privateMessage = `${sender} (private): ${message}`;
        addChatMessage({ username: sender, message: privateMessage });

        // add to list of private messages
        privatemsgList.push({ sender, message });
    });
    //
    const sendMessage = () => {
        var message = cleanInput(inputMessage.val());
        if (message && connected) {
            inputMessage.val('');
                
             // Create a message object with type (public or private)
            var messageType = (currentChatroom === 'general') ? 'public' : 'private';
            var messageObject = {
                type: messageType,
                username: username,
                message: message
            };

            addChatMessage({
                username: username,
                message: message
            });

            socket.emit('new_message', message);

            console.log("CURRENT CHAT: "+currentChatroom);
            if (currentChatroom == 'general') {
                // add own message to list of sent public messages
                publicmsgList.push({username, message})
            } else {
                // add to private chat
                privatemsgList.push({
                    recipient: currentChatroom,
                    sender: username,
                    message: message
                })
            }
            // Add the message only if it matches the current chatroom
            if ((messageType === 'public' && currentChatroom === 'general') ||
            (messageType === 'private' && currentChatroom !== 'general')) {
                addChatMessage({
                    username: username,
                    message: message
                });

            // Emit the appropriate event to the server
            socket.emit(messageType === 'public' ? 'new_message' : 'private_message', message);

            // Update the message list
            if (messageType === 'public') {
                publicmsgList.push({username, message})
            } else {
                privatemsgList.push({
                    recipient: currentChatroom,
                    sender: username,
                    message: message
                });
            }
            }
        }
    }

    

    const addChatMessage = (data, options) => {
        var typingMessages = getTypingMessages(data);
        options = options || {};
        if (typingMessages.length !== 0) {
            options.fade = false;
            typingMessages.remove();
        }
        var usernameDiv = $('<span class="username"/>').text(data.username).css('font-weight', 'bold');
        var messageBodyDiv = $('<p class="text">').text(data.message);
        var typingClass = data.typing ? 'typing' : '';
        var responseDiv = $('.response:last').data('username', data.username).addClass(typingClass).append(usernameDiv, messageBodyDiv);
        var messageDiv = $('.message text-only').append(responseDiv);
        addMessageElement(messageDiv, options);
    }
    
    //? Commented the typing shit simply because too much headache to fix it and we dont really need it now 


    const addChatTyping = (data) => {
        data.typing = true;
        data.message = 'is typing';
        addChatMessage(data);
    }

    const removeChatTyping = (data) => {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    const addMessageElement = (el, options) => {
        var el = $(el);
        
        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            el.hide().fadeIn(150);
        }
        if (options.prepend) {
            messages.prepend(el);
        } else {
            messages.append(el);
        }
        messages[0].scrollTop = messages[0].scrollHeight;
    }

    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    const updateTyping = () => {
        if (connected) {
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
        }
    }

    const getTypingMessages = (data) => {
        return $('.typing.message').filter(function (i) {
            return $(this).data('username') === data.username;
        });
    }

    win.keydown(event => {
        
        // Auto-focus the current input when a key is typed
        
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            currentInput.focus();
        }
        
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
                socket.emit('typing_stop');
                typing = false;
            } else {
            setUsername();
        }
    }
    });
    inputMessage.on('input', () => {
        updateTyping();
    });

    loginPage.click(() => {
        currentInput.focus();
    });

    inputMessage.click(() => {
        inputMessage.focus();
    });

    socket.on('login', (data) => {
        connected = true;
        setParticipantsMessage(data);
    });

    socket.on('new_message', (data) => {
        addChatMessage(data);

        // add to public msg list
        publicmsgList.push(data);
    });

    socket.on('user_joined', (data) => {
        log(data.username + ' joined');
        setParticipantsMessage(data);
    });

    socket.on('user_left', (data) => {
        log(data.username + ' left');
        setParticipantsMessage(data);
        removeChatTyping(data);
    });

    socket.on('typing', (data) => {
        addChatTyping(data);
    });

    socket.on('typing_stop', (data) => {
        removeChatTyping(data);
    });

    socket.on('disconnect', () => {
        log('You have been disconnected');
    });

    socket.on('reconnect', () => {
        log('You have been reconnected');
        if (username) {
            socket.emit('user_added', username);
        }
    });

    socket.on('reconnect_error', () => {
        log('Attempt to reconnect has failed');
    });

    // 
    function loadChatHistory(messageList) {
        clearChatArea();
        messageList.forEach(function(message) {
            addChatMessage({
                username: message.username,
                message: message.message
            });
        });
    }

// });
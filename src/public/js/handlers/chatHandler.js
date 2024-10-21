export function handleChat(userId, userName, userImage, roomId) {
  //   const userId = "{{ currentUser._id }}"; // The ID of the current user joining
  //   const userName = "{{ currentUser.userName }}"; // UserName of current user
  //   const userImage = "{{ currentUser.userImage }}"; // Profile pic of current user
  //   const roomId = "{{ roomId }}"; // The room ID to join (fetched dynamically)
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const messagesDiv = document.getElementById("messages");
  const typingIndicator = document.getElementById("typing-indicator");
  const typingUserSpan = document.getElementById("typing-user");

  let typingTimeout;

  // Join the chat room
  userSocket.emit("joinRoom", { roomId });

  // Receive chat history and display it
  userSocket.on("chatHistory", (chatHistory) => {
    renderChatHistory(chatHistory);
  });

  // Listen for new messages
  userSocket.on("newMessage", (newMessage) => {
    appendMessage(newMessage);
  });

  // Typing event
  messageInput.addEventListener("input", () => {
    userSocket.emit("typing", { roomId, userName });
  });

  // Typing event listener (when another user is typing)
  userSocket.on("typing", ({ userName }) => {
    typingUserSpan.textContent = `${userName} is typing...`;
    typingIndicator.style.display = "block";

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      typingIndicator.style.display = "none";
    }, 2000); // Hide typing indicator after 2 seconds of inactivity
  });

  // Send message logic
  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message !== "") {
      userSocket.emit("saveMessage", {
        roomId,
        message,
        userId,
        userName,
        userImage,
      });
      messageInput.value = ""; // Clear input field
    }
  });

  // Function to render chat history and separate messages by date
  function renderChatHistory(chatHistory) {
    let lastDate = null;
    messagesDiv.innerHTML = ""; // Clear previous messages

    chatHistory.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      if (messageDate !== lastDate) {
        appendDateIndicator(messageDate);
        lastDate = messageDate;
      }
      appendMessage(message);
    });
  }

  // Function to append individual messages
  function appendMessage(message) {
    const isSender = message.userId === userId; // Check if the user is the sender
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isSender ? "sent" : "received");

    const profilePicElement = document.createElement("div");
    profilePicElement.classList.add("profile-pic");
    profilePicElement.style.backgroundImage = `url(${message.userImage})`;

    const messageContentElement = document.createElement("div");
    messageContentElement.classList.add("message-content");

    const messageBubbleElement = document.createElement("div");
    messageBubbleElement.classList.add("message-bubble");
    messageBubbleElement.textContent = message.message; // Use the decrypted message

    const messageTimeElement = document.createElement("div");
    messageTimeElement.classList.add("message-time");
    const messageTime = new Date(message.createdAt);
    messageTimeElement.textContent = messageTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageContentElement.appendChild(messageBubbleElement);
    messageContentElement.appendChild(messageTimeElement);

    if (isSender) {
      messageElement.appendChild(messageContentElement);
      messageElement.appendChild(profilePicElement);
    } else {
      messageElement.appendChild(profilePicElement);
      messageElement.appendChild(messageContentElement);
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the latest message
  }

  // Function to append date indicator
  function appendDateIndicator(date) {
    const dateElement = document.createElement("div");
    dateElement.classList.add("date-indicator");
    dateElement.textContent = date;
    messagesDiv.appendChild(dateElement);
  }
}

// This function will establish the Socket.IO connection
export function connectSocketIO(UID) {
  if (UID) {
    if (!window.userSocket) {
      const socket = io("ws://localhost:3000", {
        query: { userId: UID },
      });

      // Add error handling
      socket.on("connect_error", (err) => {
        console.error("Socket connection error: ", err);
      });

      socket.on("connect_timeout", () => {
        console.warn("Socket connection timed out.");
      });

      window.userSocket = socket;
    }
  } else {
    console.log("No trader card found.");
  }
}

export function handleNotifications(Notifications, notificationCountElement) {
  if (window.userSocket) {
    // Fetching notifications
    window.userSocket.emit("fetchNotifications");

    // Listening for the notifications from the server
    window.userSocket.on("notifications", (notifications) => {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      );

      Notifications = unreadNotifications;
      if (unreadNotifications.length > 0) {
        notificationCountElement.textContent = unreadNotifications.length;
        notificationCountElement.style.display = "block";
      } else {
        notificationCountElement.style.display = "none";
      }
    });

    // Listening for the notifications from the server
    window.userSocket.on("newNotification", (notification) => {
      Notifications.push(notification);
      if (Notifications.length > 0) {
        notificationCountElement.textContent = Notifications.length;
        notificationCountElement.style.display = "block";
      } else {
        notificationCountElement.style.display = "none";
      }
    });
  }
}

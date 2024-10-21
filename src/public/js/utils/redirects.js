// REDIRECTS
export function redirectToFacebook() {
  // window.location.href = '/sso/facebook';
}

export function redirectToGoogle() {
  window.location.href = "/sso/google";
}

export function signOut() {
  localStorage.setItem("isLoggingOut", "true");
  if (window.userSocket) {
    // Emit a logout event before disconnecting
    window.userSocket.emit("userLogout", () => {
      window.userSocket.disconnect();
    });
  }
  localStorage.clear();
  window.location.href = "/logout";
}

export function createOffer() {
  window.location.href = "/offer/create";
}

export function displayDashboard() {
  window.location.href = "/user";
}

export function goBack() {
  window.history.back();
}

export function redirectToEndpoint(button) {
  const buttonText = button.textContent.trim().toLowerCase();
  let endpoint = "";

  if (buttonText === "signup") {
    endpoint = "/signup";
  } else if (buttonText === "login") {
    endpoint = "/login";
  } else if (buttonText === "explore") {
    endpoint = "/login";
  }

  if (endpoint) {
    window.location.href = endpoint;
  }
}

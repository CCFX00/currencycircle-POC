// Upload file to server
export function uploadFile() {
  const fileInput = document.getElementById("proofOfID");
  const file = fileInput.files[0];
  const step1Data = JSON.parse(localStorage.getItem("step1Data"));
  const email = step1Data.email;

  if (file && email) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    const uploadResponseDiv = document.getElementById("uploadResponse");
    uploadResponseDiv.textContent = "Uploading file...";

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          uploadResponseDiv.textContent =
            data.message || "File uploaded successfully.";
        } else {
          uploadResponseDiv.textContent = data.message || "File upload failed.";
        }
      })
      .catch((error) => {
        uploadResponseDiv.textContent = "An error occurred during file upload.";
      });
  } else {
    uploadResponseDiv.textContent =
      "Please select a file and provide a valid email.";
  }
}

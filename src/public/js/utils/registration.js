// COLLECT USER DATA AT SIGN UP
// step one
export function nextStep() {
  const formDataStep1 = new FormData(
    document.getElementById("registrationFormStep1")
  );
  const dataStep1 = Object.fromEntries(formDataStep1.entries());
  localStorage.setItem("step1Data", JSON.stringify(dataStep1));
  window.location.href = "register2";
}

// step two
export function submitFormData() {
  // Retrieve step 1 data from local storage
  const step1Data = JSON.parse(localStorage.getItem("step1Data"));

  // Collect form data from step 2
  const formDataStep2 = new FormData(
    document.getElementById("registrationFormStep2")
  );
  const dataStep2 = Object.fromEntries(formDataStep2.entries());

  // Combine step 1 and step 2 data
  const combinedData = { ...step1Data, ...dataStep2 };
  delete combinedData.files; // Remove the files field before submitting

  // Set combined data to hidden input field
  document.getElementById("step1Data").value = JSON.stringify(combinedData);

  // Submit the form
  document.getElementById("registrationFormStep2").submit();

  // Clear all data from local storage
  localStorage.clear();
}

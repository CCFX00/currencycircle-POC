function nextStep() {
    const formDataStep1 = new FormData(document.getElementById('registrationFormStep1'))
    const dataStep1 = Object.fromEntries(formDataStep1.entries())
    localStorage.setItem('step1Data', JSON.stringify(dataStep1))
    window.location.href = 'register2'
}

function submitFormData() {
    // Retrieve step 1 data from local storage
    const step1Data = JSON.parse(localStorage.getItem('step1Data'))

    // Collect form data from step 2
    const formDataStep2 = new FormData(document.getElementById('registrationFormStep2'))
    const dataStep2 = Object.fromEntries(formDataStep2.entries())

    // Combine step 1 and step 2 data
    const combinedData = { ...step1Data, ...dataStep2 }

    // Set combined data to hidden input field
    document.getElementById('step1Data').value = JSON.stringify(combinedData)

    // Submit the form
    document.getElementById('registrationFormStep2').submit()

    // Clear all data from local storage
    localStorage.clear();
}

function submitLoginFormData(){
    document.getElementById('userLogin').submit()
    // window.location.href = '/user'
}

function submitforgotPasswordData(){
    document.getElementById('forgotPassword').submit()
}

function submitresetPasswordData(){
    document.getElementById('resetPassword').submit()
}

function verifyCode() {
    const code = document.getElementById('verificationCode').value;
    const message = document.getElementById('message');
    if (code.length === 6) {
        // This is where you would typically send the code to your server for verification
        // For the purposes of this example, we'll just display a success message
        message.textContent = 'Verification successful!';
        message.style.color = 'green';
    } else {
        message.textContent = 'Please enter a valid 6-digit code.';
        message.style.color = 'red';
    }
}
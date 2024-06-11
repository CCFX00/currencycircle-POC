export const displayError = (err: any) => {
    let errorMessage = "An error occurred while processing your request.";
        let success = false;
        let status = 500;

        if (err.response) {
            errorMessage = err.response.data.message || errorMessage;
            success = err.response.data.success || success;
            status = err.response.status || status;
        } else if (err.message === "Please login to access this resource") {
            errorMessage = err.message;
            status = 401;
        } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            errorMessage = "Invalid or expired token. Please login again.";
            status = 401;
        }

        return {errorMessage, success, status}
}
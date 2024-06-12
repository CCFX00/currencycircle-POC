export const endpoints = {
    signup: 'http://localhost:3000/ccfx/api/v1/signup',
    login: 'http://localhost:3000/ccfx/api/v1/login',
    logout: 'http://localhost:3000/ccfx/api/v1/logout',
    oauthGooglePost: 'http://localhost:3000/ccfx/api/v1/auth/google',
    oauthGoogleGet: 'http://localhost:3000/ccfx/api/v1/oauth',
    verifyUser: 'http://localhost:3000/ccfx/api/v1/verify',
    resendUserOTP: 'http://localhost:3000/ccfx/api/v1/resendOTP',
    forgotPassword: 'http://localhost:3000/ccfx/api/v1/password/forgot',
    resetPassword: 'http://localhost:3000/ccfx/api/v1/password/reset',
    getUser: 'http://localhost:3000/ccfx/api/v1/user',
    getTcs: 'http://localhost:3000/ccfx/api/v1/get/tcs',
    getSingleTcs: 'http://localhost:3000/ccfx/api/v1/get/tcs?version=4.0',
    registerTcs: 'http://localhost:3000/ccfx/api/v1/reg/tcs',
    updateUserTcs: 'http://localhost:3000/ccfx/api/v1/update/tcs/users',
    acceptTcs: 'http://localhost:3000/ccfx/api/v1/accept/tcs/',
    getLatestTcs: 'http://localhost:3000/ccfx/api/v1/tcs/latest',
    fileUpload: 'http://localhost:3000/ccfx/api/v1/upload'
};

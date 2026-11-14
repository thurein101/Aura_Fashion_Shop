export const ErrorCodes = {
  ACCOUNT_FROZEN: {
    code: "Frozen",
    message: "Your account has been frozen. Please contact support.",
  },
  ADMIN_ACCOUNT: { code: "Admin", message: "Admin accounts cannot register." },
  EMAIL_ALREADY_EXISTS: {
    code: "EmailExists",
    message: "This email is already registered.",
  },
  INVALID_CREDENTIALS: {
    code: "InvalidCredentials",
    message: "Invalid email or password.",
  },
  USER_NOT_FOUND: { code: "UserNotFound", message: "User not found." },
  INVALID_OTP: { code: "InvalidOTP", message: "Invalid verification code." },
  OTP_EXPIRED: {
    code: "OTPExpired",
    message: "Verification code has expired.",
  },
  OTP_ALREADY_USED: {
    code: "OTPAlreadyUsed",
    message: "Verification code has already been used.",
  },
  EMAIL_NOT_VERIFIED: {
    code: "EmailNotVerified",
    message: "Email is not verified.",
  },
  PASSWORD_RESET_REQUIRED: {
    code: "PasswordResetRequired",
    message: "Password reset is required.",
  },
};

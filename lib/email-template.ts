// lib/email-templates.ts

export function getOTPEmailHtml(otp: string, type: "email-verification" | "forget_password" | string) {
  const isReset = type === "forget_password";
  const title = isReset ? "Reset Your Password" : "Verify Your Email";
  const message = isReset 
    ? "You requested to reset your password. Here is your authorization code:" 
    : "Welcome to AURA. Please use the following code to verify your email address:";

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F9F8F6; padding: 40px 20px; text-align: center; color: #1c1917;">
      
      <!-- Brand Logo -->
      <h1 style="font-size: 32px; font-weight: 900; letter-spacing: 0.2em; margin-bottom: 40px; margin-top: 0;">
        AURA<span style="color: #ea580c;">.</span>
      </h1>
      
      <!-- Content Box -->
      <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 12px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
        <h2 style="font-size: 20px; font-weight: bold; margin-top: 0; margin-bottom: 16px; color: #1c1917;">
          ${title}
        </h2>
        <p style="font-size: 15px; color: #57534e; line-height: 1.6; margin-bottom: 30px;">
          ${message}
        </p>
        
        <!-- OTP Code -->
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1c1917; background-color: #F9F8F6; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
          ${otp}
        </div>
        
        <p style="font-size: 13px; color: #78716c; line-height: 1.5; margin-bottom: 0;">
          If you didn't request this code, you can safely ignore this email. The code will expire shortly.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 40px; font-size: 12px; color: #a8a29e; letter-spacing: 0.05em; text-transform: uppercase;">
        © ${new Date().getFullYear()} AURA Fashion. All rights reserved.
      </div>
      
    </div>
  `;
}
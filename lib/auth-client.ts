import { emailOTPClient } from "better-auth/client/plugins"
import { nextCookies } from "better-auth/next-js"
import { createAuthClient } from "better-auth/react"
export const { signIn, signUp, useSession ,emailOtp, signOut} = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "https://aura-fashion-shop.vercel.app",
    fetchOptions: {
        credentials: "include", // Include cookies in requests
    },
    plugins: [
        emailOTPClient() , nextCookies()
    ]
})
export type ActionResponse<T = undefined> = {
    success: boolean;
    data?: T;
    error?: string;
    code: string;
    message: string;
    fieldError?: Record<string, string[]>; 
};
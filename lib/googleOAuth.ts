// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// Initialize Google Sign-In
export const initializeGoogleSignIn = (callback: (response: any) => void) => {
  if (typeof window !== "undefined" && (window as any).google) {
    (window as any).google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: callback,
    });
  }
};

// Render Google Sign-In Button
export const renderGoogleButton = (elementId: string) => {
  if (typeof window !== "undefined" && (window as any).google) {
    (window as any).google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
      }
    );
  }
};

// Prompt Google One Tap
export const promptGoogleOneTap = () => {
  if (typeof window !== "undefined" && (window as any).google) {
    (window as any).google.accounts.id.prompt();
  }
};

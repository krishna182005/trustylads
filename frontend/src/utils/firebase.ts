// Google Identity Services configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Load Google Identity Services script
export const loadGoogleIdentityServices = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google && (window as any).google.accounts) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
};

// Initialize Google Identity Services
export const initializeGoogleIdentityServices = async () => {
  await loadGoogleIdentityServices();
  
  if (!(window as any).google?.accounts) {
    throw new Error('Google Identity Services not loaded');
  }

  return (window as any).google.accounts;
};

// Initialize Google One Tap
export const initializeGoogleOneTap = async () => {
  const accounts = await initializeGoogleIdentityServices();
  
  return new Promise((resolve, reject) => {
    try {
      accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }
          resolve(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (error) {
      reject(error);
    }
  });
};

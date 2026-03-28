// TEMPORARY: Skip Firebase initialization
console.log('Firebase notifications disabled - no configuration');

export const requestPermissionAndGetToken = async () => {
  console.log('Push notifications not available');
  return null;
};

export const onMessageListener = () => 
  new Promise((resolve) => {
    // Never resolves - no notifications
  });

export const setupMessageListener = () => {
  console.log('Message listener not available');
  return () => {}; // Return empty cleanup function
};

// Mock messaging object
export const messaging = {
  getToken: async () => null,
  onMessage: () => {},
};
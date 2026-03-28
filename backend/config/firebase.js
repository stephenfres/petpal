// TEMPORARY: Skip Firebase initialization
const initializeFirebase = () => {
  console.log('⚠️  Firebase initialization skipped');
};

const messaging = () => ({
  send: async () => console.log('Mock notification sent')
});

module.exports = { initializeFirebase, messaging };
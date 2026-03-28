const setLanguage = (req, res, next) => {
  const lang = req.headers['accept-language'] || req.user?.preferredLanguage || 'en';
  const supportedLanguages = ['en', 'sw', 'fr'];
  
  req.language = supportedLanguages.includes(lang) ? lang : 'en';
  next();
};

module.exports = { setLanguage };
const blacklist = [
  'malicious.com',
  'badwebsite.net',
  'phishing.org'
];

function isUrlMalicious(url) {
  try {
    const parsedUrl = new URL(url);
    return blacklist.includes(parsedUrl.hostname);
  } catch (e) {
    return true; // Geçersiz URL ise zararlı say
  }
}

module.exports = { isUrlMalicious };

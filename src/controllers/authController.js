const jwt = require('jsonwebtoken');

// Dummy kullanıcı – test amaçlı (gerçek DB bağlantısı yerine)
const dummyUser = {
  id: 1,
  email: 'test@example.com',
  password: '123456'
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (email !== dummyUser.email || password !== dummyUser.password) {
    return res.status(401).json({ error: 'Geçersiz kullanıcı bilgisi' });
  }

  const token = jwt.sign(
    { id: dummyUser.id, email: dummyUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({ token });
};

exports.register = (req, res) => {
  const { email, password } = req.body;

  // Bu sadece demo amaçlı, normalde kullanıcı DB'ye kaydedilir.
  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre gereklidir' });
  }

  return res.status(201).json({ message: 'Kayıt başarılı', user: { email } });
};

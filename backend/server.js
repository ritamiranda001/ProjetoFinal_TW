const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend a correr em http://localhost:${PORT}`);
  console.log(`Rotas disponíveis em http://localhost:${PORT}/api`);
});

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false, // necessário para Neon
  },
});

pool.on('connect', () => {
  console.log('✅ Base de Dados conectada com sucesso!');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool de conexão', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

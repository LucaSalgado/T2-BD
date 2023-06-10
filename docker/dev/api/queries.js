const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'boca-db',
  database: 'bocadb',
  password: 'superpass',
  port: 5432,
}); // Configurando o cliente da API para se conectar ao postgres

const getTest = async (req, res) => {
  try {
    const result = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

module.exports = {
  getTest
}
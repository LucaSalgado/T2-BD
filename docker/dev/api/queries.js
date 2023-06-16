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
    const result = await pool.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getAnswerTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM answertable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getBkpTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bkptable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getClarTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clartable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getContestTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contesttable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getLangTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM langtable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getLogTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM logtable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getProblemTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM problemtable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getRunTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM runtable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getSiteTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sitetable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getSiteTimeTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sitetimetable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getTaskTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasktable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getUserTable = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usertable");
    console.log(result);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

const getByTag = async (req, res) => {
  try {
    const {contestId, entityType, entityId} = req.params;
    // Checa se o entityType é valido
    if (!["problem", "language", "site", "site/user"].includes(entityType)) {
      throw new Error();
    }
    
    let tables = {
      table: "",
      type: ""
    };
    
    switch (entityType) {
      case "problem":
        tables.table = "problemtable";
        tables.type = `AND problemnumber = ${entityId}`;
        break;
      case "language":
        tables.table = "langtable"
        tables.type = `AND langnumber = ${entityId}`;
        break;
      case "site":
        tables.table = "sitetable"
        tables.type = `AND sitenumber = ${entityId}`;
        break;
      case "site/user":
        tables.table = "usertable"
        tables.type = `AND usersitenumber = ${entityId}`;
        break;
    }
    
    const tagId = req.query.tagId
    const tagName = req.query.tagName
    const tagValue = req.query.tagValue

    let query = (`SELECT * FROM ${tables.table} NATURAL JOIN tagstable WHERE contestnumber = ${contestId} ${tables.type}`);

    if(tagId) {query = query + ` AND tagid = ${tagId}`};
    if(tagName) {query = query + ` AND tagname = '${tagName}'`};
    if(tagValue) {query = query + ` AND tagvalue = '${tagValue}'`};

    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar a consulta.');
  }
}

module.exports = {
  getAnswerTable,
  getBkpTable,
  getClarTable,
  getContestTable,
  getLangTable,
  getLogTable,
  getProblemTable,
  getRunTable,
  getSiteTable,
  getSiteTimeTable,
  getTaskTable,
  getUserTable,
  getByTag
}
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'boca-db',
  database: 'bocadb',
  password: 'superpass',
  port: 5432,
}); // Configurando o cliente da API para se conectar ao postgres

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
  getByTag
}
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "boca-db",
  database: "bocadb",
  password: "superpass",
  port: 5432,
}); // Configurando o cliente da API para se conectar ao postgres

entityTypes = ["problem", "language", "site", "site/user"];
entityNumbers = ["problemnumber", "langnumber", "sitenumber", "usersitenumber"];
entityTables = ["problemtable", "langtable", "sitetable", "usertable"];
entityIdErros = [];
sucesso = false;

const getByTag = async (req, res) => {
  try {
    let contest = await pool.query(
      `SELECT contestnumber FROM contesttable WHERE EXISTS (SELECT contestnumber FROM contesttable WHERE contestnumber = ${req.params.contestId})`
    );
    if (contest.rowCount == 0) {
      res
        .status(404)
        .send(
          "Not Found: O ID da competição ou da entidade especificado na requisição não existe."
        );
    } else {
      const { contestId, entityType, entityId } = req.params;

      // Checa se o entityType é valido
      if (!entityTypes.includes(entityType)) {
        res
          .status(400)
          .send(
            "Bad Request: Pelo menos um dos parâmetros fornecidos na requisição é inválido"
          );
      } else {
        let tables = {
          select: "",
          table: "",
          type: "",
        };

        contest = null;
        switch (entityType) {
          case "problem":
            tables.table = "problemtable";
            tables.select =
              "contestnumber, entityid, problemnumber, tagid, tagname, tagvalue";
            contest = await pool.query(
              `SELECT problemnumber FROM problemtable WHERE EXISTS (SELECT problemnumber FROM problemtable WHERE problemnumber = ${entityId})`
            );
            tables.type = `AND problemnumber = ${entityId} AND CAST(problemnumber AS varchar) = entityid`;
            break;
          case "language":
            tables.table = "langtable";
            tables.select =
              "contestnumber, entityid, langnumber, tagid, tagname, tagvalue";
            contest = await pool.query(
              `SELECT langnumber FROM langtable WHERE EXISTS (SELECT langnumber FROM langtable WHERE langnumber = ${entityId})`
            );
            tables.type = `AND langnumber = ${entityId} AND CAST(langnumber AS varchar) = entityid`;
            break;
          case "site":
            tables.table = "sitetable";
            tables.select =
              "contestnumber, entityid, sitenumber, tagid, tagname, tagvalue";
            contest = await pool.query(
              `SELECT sitenumber FROM sitetable WHERE EXISTS (SELECT sitenumber FROM sitetable WHERE sitenumber = ${entityId})`
            );
            tables.type = `AND sitenumber = ${entityId} AND CAST(sitenumber AS varchar) = entityid`;
            break;
          case "site/user":
            tables.table = "usertable";
            tables.select =
              "contestnumber, entityid, usersitenumber, tagid, tagname, tagvalue";
            contest = await pool.query(
              `SELECT usersitenumber FROM usertable WHERE EXISTS (SELECT usersitenumber FROM usertable WHERE usersitenumber = ${entityId})`
            );
            tables.type = `AND usersitenumber = ${entityId} AND CAST(usersitenumber AS varchar) = entityid`;
            break;
        }

        if (contest.rowCount == 0) {
          res
            .status(404)
            .send(
              "Not Found: O ID da competição ou da entidade especificado na requisição não existe."
            );
        } else {
          const tagId = req.query.tagId;
          const tagName = req.query.tagName;
          const tagValue = req.query.tagValue;

          let query = `SELECT ${tables.select} FROM ${tables.table} NATURAL JOIN tagstable WHERE contestnumber = ${contestId} ${tables.type}`;

          if (tagId) {
            query = query + ` AND tagid = ${tagId}`;
          }
          if (tagName) {
            query = query + ` AND tagname = '${tagName}'`;
          }
          if (tagValue) {
            query = query + ` AND tagvalue = '${tagValue}'`;
          }

          const result = await pool.query(query);
          if (result.rowCount > 0) {
            resultado = trataMensagem(result.rows, entityType, entityId);
            res.status(200).json(resultado);
          } else {
            res.status(204).send("Não foram encontrados tags da entidade!");
          }
        }
      }
    }
  } catch (error) {
    res
      .status(500)
      .send("Não foi possível acessar o banco de dados, verifique a sua rota.");
  }
};

function trataMensagem(result, entityType, entityId) {
  const entityTag = {
    entityType: entityType,
    entityId: entityId,
    tag: result.map((tagItem) => ({
      id: tagItem.tagid,
      name: tagItem.tagname,
      value: tagItem.tagvalue,
    })),
  };

  const mensagem = {
    message: "Success: tag(s) encontrada(s).",
    entityTag: entityTag,
  };

  return mensagem;
}

async function verificaContest(contestId, res) {
  const result = await pool.query(
    `SELECT contestnumber FROM contesttable WHERE EXISTS (SELECT contestnumber FROM contesttable WHERE contestnumber = ${contestId})`
  );
  if (result.rowCount == 0) {
    throw new Error(
      "Not Found: O ID da competição especificado na requisição não existe."
    );
  }
}

async function verificaEntityType(body, res) {
  for (const entity of body.entityTag) {
    if (!entityTypes.includes(entity.entityType)) {
      throw new Error(
        "O ID da competição ou o JSON fornecido no corpo da requisição é inválido."
      );
    }
  }
}

const postByTag = async (req, res) => {
  const body = req.body;
  try {
    await verificaContest(req.params.contestId, res);
  } catch (error) {
    res.status(404).send("Bad Request: " + error.message);
    return;
  }

  try {
    await verificaEntityType(body);
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
    return;
  }

  try {
    for (const entity of body.entityTag) {
      if (entity.entityType === "site/user") {
        result = await pool.query(
          `SELECT ${
            entityNumbers[entityTypes.indexOf(entity.entityType)]
          } FROM ${
            entityTables[entityTypes.indexOf(entity.entityType)]
          } WHERE usersitenumber = ${
            entity.entityId.split("/")[0]
          } AND usernumber = ${entity.entityId.split("/")[1]}`
        );
      } else {
        result = await pool.query(
          `SELECT ${
            entityNumbers[entityTypes.indexOf(entity.entityType)]
          } FROM ${
            entityTables[entityTypes.indexOf(entity.entityType)]
          } WHERE ${entityNumbers[entityTypes.indexOf(entity.entityType)]} = ${
            entity.entityId
          }`
        );
      }
      if (result.rowCount === 0) {
        entityIdErros.push(
          `A entityId = ${entity.entityId} não foi encontrada e portanto suas tags não foram incluídas`
        );
      } else {
        sucesso = true;
        for (const tag of entity.tag) {
          await pool.query(
            `INSERT INTO tagstable (entityid, tagid, tagname, tagvalue) VALUES ('${entity.entityId}', ${tag.id}, '${tag.name}', '${tag.value}') ON CONFLICT (entityid, tagid) DO NOTHING;`
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  if (entityIdErros.length > 0 && sucesso == true) {
    res.status(207).send({
      message:
        "Multi-Status: Algumas Tags foram incluidas, porém alguns erros ocorreram",
      errors: entityIdErros,
    });
  } else if (sucesso == false) {
    res
      .status(422)
      .send(
        "Unprocessable Entity: Todas as entityId enviadas não foram encontradas e portanto elas podem não estar presentes no banco de dados ou as entityId buscadas apresentam erro."
      );
  } else {
    res.status(204).send("Sucess: tag(s) atualizad(s).");
  }

  sucesso = false;
  entityIdErros = [];
};

const putByTag = async (req, res) => {
  const body = req.body;
  try {
    await verificaContest(req.params.contestId, res);
  } catch (error) {
    res.status(404).send("Bad Request: " + error.message);
    return;
  }
  try {
    await verificaEntityType(body);
    // Restante do código se todos os entityTypes forem válidos
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
    return; // Interrompe a execução do código após enviar a resposta de erro
  }

  entityIdErros = [];
  for (const entity of body.entityTag) {
    for (const tag of entity.tag) {
      result = undefined;
      result = await pool.query(
        `UPDATE tagstable SET tagname = '${tag.name}', tagvalue = '${tag.value}' WHERE entityid = '${entity.entityId}' AND tagid = ${tag.id}`
      );
      if (result.rowCount === 0) {
        entityIdErros.push(
          `A tag de nome: ${tag.name}, valor: ${tag.value}, entityId: ${entity.entityId} e id:${tag.id}, não foi encontrada e portanto não pode ser atualizada`
        );
      } else {
        sucesso = true;
      }
    }
  }

  if (entityIdErros.length > 0 && sucesso == true) {
    res.status(207).send({
      message:
        "Multi-Status: Algumas Tags foram atualizadas, porém alguns erros ocorreram",
      errors: entityIdErros,
    });
  } else if (sucesso == false) {
    res
      .status(422)
      .send(
        "Unprocessable Entity: Todas as entityId enviados não foram encontradas e portanto elas podem não estar presentes no banco de dados ou as entityId buscadas apresentam erro."
      );
  } else {
    res.status(204).send("Sucess: tag(s) atualizad(s).");
  }

  sucesso = false;
  entityIdErros = [];
};

const deleteByTag = async (req, res) => {
  const body = req.body;
  try {
    await verificaContest(req.params.contestId, res);
  } catch (error) {
    res.status(404).send("Bad Request: " + error.message);
    return;
  }
  try {
    await verificaEntityType(body);
    // Restante do código se todos os entityTypes forem válidos
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
    return; // Interrompe a execução do código após enviar a resposta de erro
  }

  entityIdErros = [];
  for (const entity of body.entityTag) {
    for (const tag of entity.tag) {
      const deleteResult = await pool.query(
        `DELETE FROM tagstable WHERE tagname = '${tag.name}' AND tagvalue = '${tag.value}' AND entityid = '${entity.entityId}' AND tagid = ${tag.id} `
      );
      if (deleteResult.rowCount === 0) {
        entityIdErros.push(
          `A tag de nome: ${tag.name}, valor: ${tag.value}, entityId: ${entity.entityId} e id:${tag.id}, não foi encontrada e portanto não pode ser deletada.`
        );
      } else {
        sucesso = true;
      }
    }
  }

  if (entityIdErros.length > 0 && sucesso == true) {
    res.status(207).send({
      message:
        "Multi-Status: Algumas Tags foram deletadas, porém alguns erros ocorreram.",
      errors: entityIdErros,
    });
  } else if (sucesso == false) {
    res
      .status(422)
      .send(
        "Unprocessable Entity: Todas as tags enviadas não foram encontradas e portanto elas podem não estar presentes no banco de dados ou as tags buscadas apresentam erro."
      );
  } else {
    res.status(204).send("Sucess: tag(s) excluída(s).");
  }

  sucesso = false;
  entityIdErros = [];
};

module.exports = {
  getByTag,
  postByTag,
  putByTag,
  deleteByTag,
};

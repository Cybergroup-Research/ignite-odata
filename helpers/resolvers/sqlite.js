const { GetUpdateSetColumns, GetInsertionColumnsAndValues, GetMetadataQuery, GetKeyFromModel } = require('../sql')

// returns a mysql query based on url method and parameters
exports.GetQuery = async (info) => {
  try {
    if (info.method === 'GET') {
      return await this.GetSelectQuery(info)
    }
    else if (info.method === 'POST') {
      return await this.GetInsertQuery(info)
    }
    else if (info.method === 'PUT' || info.method === 'PATCH') {
      return await this.GetUpdateQuery(info)
    }
    else if (info.method === 'DELETE') {
      return await this.GetDeleteQuery(info)
    }
  } catch (err) {
    return (result = {
      message: "Couldn't create mysql query",
      error: err
    });
  }
};

exports.GetSelectQuery = async (info) => {
  try {
    query = 'select * from tablename';
    full_resource_path = info.resource_path
    data_query_params = info.query_params
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    //the resource_path array can have atmost 4 components
    //1 The empty element wrapping the odata root service /ServiceRoot/ or /example/ anything the user might like

    //2 The root or odata element ending in forward slash according to odata convention

    //3 The entity name along with the property for comparison, e.g.
    //e.g.
    //http://127.0.0.1:1880/root/users
    //http://127.0.0.1:1880/root/users('Ravi')

    //4 Property name to fetch raw value of properties passed in the url,
    //Note: Multiple properties must be separeted by comma in url
    //http://127.0.0.1:1880/root/users(UserName='Ravi')/name,class

    //testing if the user requested metdata, batch service request, or data from entity
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      query = `BatchSegment translation is not supported`
    }
    else {
      //checking for param in parenthesis 
      if (full_resource_path.includes("(")) {
        //isolating table name and first comparison parameter
        entity_with_param = entity
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0]
        param = entity_with_param[1]
        query = query + " WHERE "
        primary_key = GetKeyFromModel(info.data_model, entity)
        query = query + primary_key + " = " + param
      }
      //replacing table name with extracted entity
      query = query.replace("tablename", entity);

      //extracting column names(property) from url
      // e.g. GET serviceRoot/Airports('KSFO')/Name

      //logic to add column names in query
      if (properties) {
        query = query.replace("*", properties);
      }
      //logic to support query data using query parameters
      if (data_query_params) {

      }
    }
    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};

exports.GetInsertQuery = async (info) => {
  try {
    const data = GetInsertionColumnsAndValues(info.body);
    query = `INSERT INTO tablename(${data.columns}) VALUES (${data.Values})`
    full_resource_path = info.resource_path
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      query = `BatchSegment translation is not supported`
    }
    else {
      query = query.replace("tablename", entity);
    }
    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};

exports.GetUpdateQuery = async (info) => {
  try {
    const setConditions = GetUpdateSetColumns(info.body);
    query = `UPDATE tablename SET ${setConditions}`;
    full_resource_path = info.resource_path
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      query = `BatchSegment translation is not supported`
    }
    else {
      //checking for param in parenthesis (key)
      if (full_resource_path.includes("(")) {
        entity_with_param = entity
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0]
        param = entity_with_param[1]
        query = query + " WHERE "
        primary_key = GetKeyFromModel(info.data_model, entity)
        query = query + primary_key + " = " + param
      }
      //replacing table name with extracted entity
      query = query.replace("tablename", entity);
    }
    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};

exports.GetDeleteQuery = async (info) => {
  try {
    query = 'DELETE FROM tablename';
    full_resource_path = info.resource_path
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      query = `BatchSegment translation is not supported`
    }
    else {
       //checking for param in parenthesis 
       if (full_resource_path.includes("(")) {
        //isolating table name and first comparison parameter
        entity_with_param = entity
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0]
        param = entity_with_param[1]
        query = query + " WHERE "
        primary_key = GetKeyFromModel(info.data_model, entity)
        query = query + primary_key + " = " + param
      }
      //replacing table name with extracted entity
      query = query.replace("tablename", entity);
    }
    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};
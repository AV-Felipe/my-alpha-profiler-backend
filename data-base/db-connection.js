require("dotenv").config();
const { Pool } = require("pg");

// Programmatically setting the connection information in a client object
// (in a real world scenario, these values could passed using environment variables
//so they are not exposed in code)

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Provides a more debugable connection method
async function getClient() {
  try {
    const client = await pool.connect();
    console.log("Connect");
    // store the original form for the methods we are going to patch
    const query = client.query;
    const release = client.release;

    const timeoutId = setTimeout(() => {
      console.log("A client has been checked out for more than 5 seconds!");
      console.log(
        `The last executed query on this client was: ${client.lastQuery}`
      );
    }, 5000);

    // monkey patch the query method, by adding a lastQuery property to the current connection,
    //to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    // monkey patch the release method so that it "unmonckey patch" both, himself and the query methods
    client.release = () => {
      // clear our timeout
      clearTimeout(timeoutId);

      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;

      return release.apply(client);
    };

    return client;
  } catch (error) {
    console.log(error);
  }
}
// Here we export an object with methods for operating in the DB
// PG works with callback or promises logic, we are working with the latter, here
module.exports = {
  // method that takes any query string and optional query parameters
  //and returns an array with the query result
  async query(queryString, parameters) {
    const client = await getClient();
    // const start = Date.now();
    const response = await client.query(queryString, parameters);
    // const duration = Date.now() - start;
    // console.log('Query executada!', {queryString, duration, rows: response.rowCount});
    client.release();
    return response.rows;
  },
};

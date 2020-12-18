// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require('faunadb'),
  q = faunadb.query;
  require("dotenv").config()
exports.handler = async (event, context) => {
  try {
    var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
    var result = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("TasksIndex"))),
        q.Lambda("x", q.Get(q.Var("x")))
      )
   
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),

    }
  } catch (error) {
    console.log('Error: ');
    console.log(error);
  }
}

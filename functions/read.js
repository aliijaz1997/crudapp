// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require('faunadb'),
  q = faunadb.query;
  require("dotenv").config()
exports.handler = async (event, context) => {
  try {
    var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
    var result = await client.query(
      q.Map(
        // iterate each item in result
        q.Paginate(
          // make paginatable
          q.Match(
            // query index
            q.Index('TasksIndex') // specify source
          )
        ),
        (ref) => q.Get(ref) // lookup each result by its reference
      )
    );
    console.log("Document retrived from Container in Database: " + JSON.stringify(result.data));

    // ok
    return {
      statusCode: 200,
      body: JSON.stringify(result),

    }
  } catch (error) {
    console.log('Error: ');
    console.log(error);
  }
}

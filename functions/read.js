// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb = require('faunadb'),
  q = faunadb.query;

exports.handler = async (event, context) => {
  try {

    // Only allow POST
    // if (event.httpMethod !== "post") {
    //   return { statusCode: 405, body: "Method Not Allowed" };
    // }

    var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });

    var result = await client.query(
        q.Map(
            q.Paginate(q.Match(q.Index('TasksIndex'))),
            q.Lambda(x => q.Get(x))
          )
    );

    console.log(" Data recieved from the data base " + result);
    return {
      statusCode: 200,
      body: JSON.stringify({ id: `${result.ref.id}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

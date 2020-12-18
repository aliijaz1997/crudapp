// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require('faunadb'),
  q = faunadb.query;
  require("dotenv").config()
exports.handler = async (event, context) => {
  // console.log(event.body)
  try {

    // Only allow Put
    // if (event.httpMethod !== "put") {
    //   return { statusCode: 405, body: "Method Not Allowed" };
    // }
    var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
    var reqobj = JSON.parse(event.body)
    console.log(reqobj, "task")
    var result = await client.query(
      q.Update(q.Ref(q.Collection('TasksTodo'), reqobj.id), {
        data: {
          name : reqobj.title, age : reqobj.description
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({id : `${result.ref.id}`}),
    }
  } catch (e) {
    console.log('Error: ');
    console.log(e);
  }
}
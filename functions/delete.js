// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require('faunadb'),
  q = faunadb.query;

exports.handler = async (event, context) => {
  // console.log(event.body)
  try {
    var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
    var id = JSON.parse(event.body)
    console.log(id, "task")
    var result = await client.query(
      q.Delete(q.Ref(q.Collection('TasksTodo'), id)));
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (e) {
    console.log('Error: ');
    console.log(e);
  }
}
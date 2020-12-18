import React, { useState, useEffect } from "react";
import { Formik, Form, ErrorMessage, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

// Material UI

const useStyles = makeStyles({
  root: {
    minWidth: 375,
    textAlign: "center",
    marginTop: 20,
    backgroundImage : "url(https://wonderfulengineering.com/wp-content/uploads/2014/09/white-wallpapers-1.jpg)"
  }
});

//.........................................//
export default function Home() {
  const [mydata, setData] = useState([]);
  const [updatedevent, setUpdatedevent] = useState();
  const [updateData, setUpdateData] = useState();
  const [isUpdating, setIsUpdating] = useState(false)
  //..............................//

  const classes = useStyles();

  //.....................//
  // console.log(updateData.ref["@ref"].id);
  // Using UseEffect to call all the tasks from database asynchronously.
  useEffect(() => {
    (async () => {
      // setIsloading(true);
      console.log("fetch called")
      await fetch("/.netlify/functions/read")
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setData(data);
        })
      // setIsloading(false)

    })()
  }, [updatedevent, isUpdating])
  console.log(mydata);

  // Function for update

  const handleupdate = id => {
    const msgUpdate = mydata.find(msg => msg.ref["@ref"].id === id)
    console.log(msgUpdate)
    setIsUpdating(true)
    setUpdateData(msgUpdate)
  }
  // Function for delete

  const handledelete = (id) => {
    console.log(id, "is being deleted")
    fetch(`/.netlify/functions/delete`, {
      method: 'POST',
      body: JSON.stringify(id)
    }).then(response => response.json())
      .then(data => {
        console.log(data.ref["@ref"].id, "has been deleted")
        setUpdatedevent(data);
      });
  }
  return (
    <div
      style={{
        backgroundImage: "url(https://cdn.shopify.com/s/files/1/0285/1316/products/w0260_1s_Triangle-Pattern-Wallpaper-for-Walls-Paper-Triangles_Repeating-Pattern-Sample-1.jpg?v=1604088000)",
        marginTop: -20,
        height: "45rem"
      }}
    >
      <React.Fragment>
        <CssBaseline />
        <Container
          maxWidth="sm">
          <h1>CRUD APP</h1>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: !isUpdating ? "" : updateData.ref["@ref"].id,
              title: !isUpdating ? "" : updateData.data.name,
              description: !isUpdating ? "" : updateData.data.age
            }}
            onSubmit={(values, actions) => {
              console.log(values)
              if (!isUpdating) {
                fetch(`/.netlify/functions/add`, {
                  method: "post",
                  body: JSON.stringify(values),
                })
                  .then(response => response.json())
                  .then(data => {
                    setUpdatedevent(data)
                    console.log(data)
                    actions.resetForm({
                      values: {
                        id: "",
                        title: "",
                        description: "",
                      },
                    })
                  })
              } else {
                setIsUpdating(true)
                fetch(`/.netlify/functions/update`, {
                  method: "put",
                  body: JSON.stringify(values),
                })
                  .then(res => res.json())
                  .then(data => {
                    console.log(data)
                    setIsUpdating(false)
                    setUpdatedevent(undefined)
                  })
              }
            }} >
            {
              (formik) => (

                <Card className={classes.root}>
                  <Form onSubmit={formik.handleSubmit}>
                    <Field
                      style={{
                        width: "20rem",
                        marginTop: 10
                      }}
                      type="text" as={TextField} variant="outlined" label="Title" name="title" id="title" />
                    <ErrorMessage name="title" render={(err) => (
                      <span style={{ color: "red" }}>{err}</span>
                    )} />
                    <br />
                    <Field
                      style={{
                        width: "20rem",
                        marginTop: 20
                      }}
                      type="text" as={TextField} label="Description" variant="outlined" name="description" id="description" />
                    <ErrorMessage name="description" />
                    <br />
                    <button
                      style={{
                        width: "10rem",
                        marginTop: 20,
                        color: "white",
                        backgroundColor: "black",
                        height: "2rem",
                        marginBottom: 10
                      }}
                      type="submit">{isUpdating ? "Update Task" : "Add Task"}</button>
                  </Form>
                </Card>
              )
            }
          </Formik>
          {
            mydata?.map((d) =>
              <Card key={d.ref["@ref"].id} className={classes.root}>
                <h2
                style = {{
                  color : "cornflowerblue",
                }}
                >
                  {d.data.name}
                </h2>
                <p
                style = {{
                  color : "slategray",
                  fontStyle : "italic",
                  fontWeight : "bold"
                }}
                >
                  {d.data.age}
                </p>
                <button
                  style={{
                    width: "10rem",
                    marginTop: 20,
                    color: "white",
                    backgroundColor: "black",
                    height: "2rem",
                    marginBottom: 10,
                    marginRight : 5
                  }}
                  onClick={() => handleupdate(d.ref['@ref'].id)}>Update</button>
                <button
                  style={{
                    width: "10rem",
                    marginTop: 20,
                    color: "white",
                    backgroundColor: "black",
                    height: "2rem",
                    marginBottom: 10
                  }}
                  onClick={() => handledelete(d.ref['@ref'].id)}>Delete</button>
              </Card>
            )
          }
        </Container>
      </React.Fragment>
    </div>
  )
}

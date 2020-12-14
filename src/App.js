import React,{useState, useEffect} from "react";
import { Formik, Form, ErrorMessage, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

export default function Home() {
  const [mydata, setData] = useState([]);
  console.log(mydata);
  useEffect(() => {
    ; (async () => {
      // setIsloading(true);
      console.log("fetch called")
      await fetch("/.netlify/functions/read")
        .then(res => res.json())
        .then(data => {
          setData(data)
        })
      // setIsloading(false)

    })()
  }, [])
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Formik initialValues={{
          title: "",
          description: ""
        }}
          onSubmit={(values) => {
            console.log(values);
            fetch(`/.netlify/functions/add`, {
              method: 'post',
              body: JSON.stringify(values)
            })
              .then(response => response.json())
              .then(data => {
                console.log("Data: " + JSON.stringify(data));
                setData(data);
              });
          }}  >
          {
            (formik) => (

              <Form onSubmit={formik.handleSubmit}>
                <div>
                  <Field type="text" as={TextField} variant="outlined" label="Title" name="title" id="title" />
                  <ErrorMessage name="title" render={(msg) => (
                    <span style={{ color: "red" }}>{msg}</span>
                  )} />
                </div>
                <div>
                  <Field type="text" as={TextField} label="Description" variant="filled" name="description" id="description" />
                  <ErrorMessage name="description" />
                </div>
                <div>
                  <button type="submit">Add Task</button>
                </div>
              </Form>
            )
          }
        </Formik>
      </Container>
    </React.Fragment>
  )
}
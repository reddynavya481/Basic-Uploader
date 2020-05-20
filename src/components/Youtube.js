import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
const initialValues = {
  name: '',
  email: '',
  channel: ''
}
const onSubmit = values => {
  console.log(values)
}

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().required('Required').email('Invalid Email'),
  channel: Yup.string().required('Required'),
})
function Youtube() {

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      <Form>
        <label htmlFor='name'>Name</label>
        <Field
          type='text'
          id='name'
          name='name'
        />
        <ErrorMessage name='name' />
        <br />

        <label htmlFor='email'>Email</label>
        <Field
          type='email'
          id='email'
          name='email'
        />
        <ErrorMessage name='email' />
        <br />

        <label htmlFor='channel'>Channel</label>
        <Field
          type='text'
          id='channel'
          name='channel'
        />
        <ErrorMessage name='channel' />
        <br />

        <button type='submit'>Submit</button>
      </Form>
    </Formik>
  )
}

export default Youtube

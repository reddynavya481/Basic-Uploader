import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
const initialValues= {
  name: '',
  email: '',
  channel: ''
}
const onSubmit=values=>{
  console.log(values)
}
const validate=values=>{
  let errors={}
  if(!values.name){
    errors.name='Required'
  }
  if(!values.email){
    errors.email='Required'
  }
  else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
    errors.email='Invalid'
  }
  if(!values.channel){
    errors.channel='Required'
  }
  return errors
}

const validationSchema=Yup.object({
  name:Yup.string().required('Required'),
  email:Yup.string().required('Required').email('Invalid Email'),
  channel:Yup.string().required('Required'),
})
function Youtube() {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema
  })
  console.log(formik.touched)
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type='text'
         id='name' 
         name='name'
         onBlur={formik.handleBlur}
         onChange={formik.handleChange}
         value={formik.values.name} />
        {formik.errors.name && formik.touched.name?<div>{formik.errors.name}</div>:null}
        <br />

        <label htmlFor='email'>Email</label>
        <input type='email' 
        id='email' name='email' 
        onBlur={formik.handleBlur} 
        onChange={formik.handleChange} 
        value={formik.values.email} />
        {formik.errors.email && formik.touched.email?<div>{formik.errors.email}</div>:null}
        <br />

        <label htmlFor='channel'>Channel</label>
        <input type='text'
         id='channel' 
         name='channel' 
         onBlur={formik.handleBlur} 
         onChange={formik.handleChange} 
         value={formik.values.channel} />
        {formik.errors.channel && formik.touched.channel?<div>{formik.errors.channel}</div>:null}
        <br />

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Youtube

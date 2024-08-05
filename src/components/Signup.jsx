import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as Yup from "yup";
import AxiosService from "../common/ApiService";
import { toast } from "react-toastify";

function Signup() {
  // State variables for error messages and form submission status
  let [errorMessage, setErrorMessage] = useState("");
  let [submit, setSubmit] = useState(false);

  // Schema for validating form fields using Yup
  const UserSchema = Yup.object().shape({
    name: Yup.string().required("* Required"),
    email: Yup.string().email("* Invalid Email").required("*Required"),
    password: Yup.string().required("*Required"),
  });

  // Hook to navigate programmatically
  let navigate = useNavigate();

  // Function to handle user registration
  const handleAddUser = async (values, { setSubmitting, setErrors }) => {
    try {
      // Send a POST request to the backend to register the user
      const res = await AxiosService.post("/user/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        // Show success message and redirect to login page on successful registration
        toast.success("Registered successfully");
        navigate("/");
      }
    } catch (error) {
      // Handle errors from the backend
      console.log(error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      // Reset the submitting state after the request is completed
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-100">
        <div className="app-header">
          <h1 className="p-2">Web Chat</h1>
        </div>
        <div className="container">
        <div className="row justify-content-center mt-3 pt-3">
          <div className="col-12 col-sm-6 card p-3">
              <h3 className="mb-4 text-center">Signup!</h3>

              {/* <!-- Signup Form --> */}
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                }}
                validationSchema={UserSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                  handleAddUser(values, { setSubmitting, setErrors });
                }}>
                {({ values, errors, touched, handleBlur, handleSubmit, handleChange, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    {/* Form field for name */}
                    <Form.Group className="mb-3">
                      <Form.Label>Name:</Form.Label>
                      <Form.Control type="text" name="name" placeholder="Enter Name" value={values.name} onBlur={handleBlur} onChange={handleChange} />
                      {errors.name && touched.name ? <div style={{ color: "red" }}>{errors.name}</div> : null}
                    </Form.Group>

                    {/* Form field for email */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control type="email" name="email" placeholder="Enter email" value={values.email} onBlur={handleBlur} onChange={handleChange} />
                      {errors.email && touched.email ? <div style={{ color: "red" }}>{errors.email}</div> : null}
                    </Form.Group>

                    {/* Form field for password */}
                    <Form.Group className="mb-3">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control type="password" name="password" placeholder="Enter password" value={values.password} onBlur={handleBlur} onChange={handleChange} />
                      {errors.password && touched.password ? <div style={{ color: "red" }}>{errors.password}</div> : null}
                    </Form.Group>

                    {/* Submit button */}
                    <button type="submit" className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" disabled={submit}>
                      {isSubmitting ? "Submitting" : "Signup"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;

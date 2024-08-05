import React,{useState} from 'react'
import { useNavigate,Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosService from "../common/ApiService";

function Login() {

   // State to manage form submission status and error messages
   const [submit, setSubmit] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
 
   // Hook to programmatically navigate to different routes
   const navigate = useNavigate();
 
   // Schema for validating login form inputs using Yup
   const UserSchema = Yup.object().shape({
     email: Yup.string().email("* Invalid Email").required("* Required"),
     password: Yup.string().required("* Required"),
   });

  // Function to handle login submission
  const handleLogin = async (values) => {
    setSubmit(true); // Set submit state to true to indicate loading
    try {
      // Make API call to login endpoint
      const res = await AxiosService.post("/user/login", {
        email: values.email,
        password: values.password,
        
      });

      // On successful login, save token and user data, and navigate based on role
      if (res.status === 200) {
        toast.success("Login Successful");
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.userData));

        navigate("/dashboard"); // Navigate to home page for other roles
      }
    } catch (error) {
      // On error, show toast notification and set error message
      toast.error("Login Failed");
      setErrorMessage(error.response?.data?.message || "An error occurred"); // Update error message state
      console.log(error);
    } finally {
      setSubmit(false); // Reset submit state
    }
  };

  return (
    <>
    <div className="w-100 ps-md-0">
    <div className="app-header">
          <h1 className="p-2">Web Chat</h1>
        </div>
      <div className="container">
        <div className="row justify-content-center mt-3 pt-3">
          <div className="col-12 col-sm-6 card p-3 m-3" >
            <h3 className="text-center mb-4">Login</h3>

            {/* <!-- Sign In Form --> */}
            <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    
                  }}
                  validationSchema={UserSchema}
                  onSubmit={(values) => {
                    handleLogin(values); // Handle form submission
                  }}
                >
                  {({ values, errors, touched, handleBlur, handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                        />
                        {errors.email && touched.email ? (
                          <div style={{ color: "red" }}>{errors.email}</div>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Enter password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                        />
                        {errors.password && touched.password ? (
                          <div style={{ color: "red" }}>
                            {errorMessage} {errors.password}
                          </div>
                        ) : null}
                      </Form.Group>
                      <button type="submit" className="btn btn-primary m-2" disabled={submit}>
                        {submit ? "Logging in" : "Login"}
                      </button>
                     <div className="d-flex justify-content-between align-items-center">
                      <Link to="/signup">Signup</Link>
                      <Link to="/forgetPassword">ForgetPassword</Link>
                     </div>
                    </Form>
                  )}
                </Formik>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
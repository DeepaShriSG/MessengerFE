import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./common/ErrorPage";
import Loading from "./common/Loading"

//Lazy components
const Login = lazy(()=>import("./components/Login"))
const Signup = lazy(()=>import("./components/Signup"))
const Dashboard = lazy(()=>import("./components/Dashboard"))

function App() {
 

  return (
    <>
     <BrowserRouter>
  
            <Suspense fallback={<Loading />}>
              <ErrorBoundary FallbackComponent={({ error }) => <ErrorPage statusCode={error.statusCode || "500"} message={error.message || "An unexpected error occurred."} />}>
             
                <Routes>

                  <Route path="/" element={<Login />} />
                  <Route path="/signup"element={<Signup/>}/>
                  <Route path="/dashboard" element={<Dashboard/>}/>

                  </Routes>
    
              </ErrorBoundary>
            </Suspense>
          
      </BrowserRouter>
    </>
  )
}

export default App

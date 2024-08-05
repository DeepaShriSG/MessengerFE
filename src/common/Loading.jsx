import React from "react";
import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <> <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Spinner animation="border text-center" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      </div>
    </>
  );
}

export default Loading;
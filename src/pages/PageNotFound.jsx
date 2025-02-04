import React from "react";

function PageNotFound(props) {
  return (
    <div className={`${"container"}`}>
      <h3
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        Ops... <br />
        Page Not Found.
      </h3>
    </div>
  );
}

export default PageNotFound;

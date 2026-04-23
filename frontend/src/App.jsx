import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("login");

  const isLoggedIn = localStorage.getItem("token");

  if (isLoggedIn) {
    return <Dashboard setPage={setPage} />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login setPage={setPage} />
      ) : (
        <Register setPage={setPage} />
      )}
    </div>
  );
}

export default App;
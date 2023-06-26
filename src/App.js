import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import "./App.css"


export const ThemeContext = createContext(null)



function App() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme =  () => {
    setTheme(theme === "light"? "dark" : "light");
  }


  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
    <div className="App"
     id={theme}
     >
      <Routes  >
        <Route
          path="/"
          element={
            <section >
              <Home />
            </section>
          }
        />
      
        <Route
          path="/signup"
          element={
            <section>
              <SignUp />
            </section>
          }
        />
        <Route
          path="/login"
          element={
            <section>
              <SignIn />
            </section>
          }
        />
      </Routes>
    </div>
     </ThemeContext.Provider>
  );
}

export default App;

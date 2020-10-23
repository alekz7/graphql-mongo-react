import React from "react";

// (A)
const themes = { 
  light: {
    color: "#000000",
    background: "#eeeeee",
    border: "1px solid #aaaaaa",
    padding: "10px"
  },
  dark: {
    color: "#ffffff",
    background: "#555555",
    border: "1px solid #222222",
    padding: "10px"
  }
};

// (B)
const ThemeContext = React.createContext(null); 

// (C)
export { themes };
export default ThemeContext;
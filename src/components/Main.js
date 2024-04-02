import React from "react";
import { useBooks } from "./contexts/BooksContext";

export default function Main({ children }) {
	const {isDarkMode} = useBooks();
	const mainStyles = {
	  backgroundColor: isDarkMode ? "#333" : "#f9f5c8",
	  color: isDarkMode ? "#fff" : "#333",
	};
	return <main style={mainStyles}>{children}</main>;
 }
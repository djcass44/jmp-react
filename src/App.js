import React from 'react';
import './App.css';
import Content from "./containers/Content";
import Nav from "./containers/Nav";

function App() {
	return (
		<div className="App">
			<Nav/>
			<Content/>
		</div>
	);
}

export default App;

import { useState } from "react";
import logo from './logo.svg';
import Message from "./Message";
import './App.css';

function App(){
  const [count, setCount] = useState(0);
  return <div><Message /></div>;
}

export default App;
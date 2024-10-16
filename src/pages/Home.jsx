import { useReducer } from "react";
import Login from "../components/Login"
import Session from "../components/Session"
import Navbar from "../components/Navbar";

export default function Home() {

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const user = localStorage.getItem("user")

  return (
    <div className="home">
      <Navbar refresh={forceUpdate}/>
      <div className="logo"><img src="/src/assets/logonobg.png" alt="niko kadi logo" /></div>
       {user ? <Session refresh={forceUpdate}/> : <Login refresh={forceUpdate}/>} 
    </div>
  )
}


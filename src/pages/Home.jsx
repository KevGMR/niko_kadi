import { useReducer } from "react";
import Login from "../components/Login"
import Session from "../components/Session"
import Navbar from "../components/Navbar";

import logo from '../assets/logonobg.png'

import { ToastContainer } from 'react-toastify';


export default function Home() {

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const user = localStorage.getItem("user")



  return (
    <div className="home">
      <Navbar refresh={forceUpdate} />
      <div className="logo">
        <img src={logo} alt="niko kadi logo" />

      </div>
      {user ? <Session refresh={forceUpdate} /> : <Login refresh={forceUpdate} />}

      <ToastContainer />
    </div>
  )
}


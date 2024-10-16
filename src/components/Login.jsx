import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { auth } from '../firebase/firebase';

import PropTypes from 'prop-types';

import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';

export default function Login({refresh}) {

  const [loading, setLoading] = useState(false)

  async function signWithGoogle() {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    console.log(result.user);
    


    localStorage.setItem("user", JSON.stringify(result));
    refresh()
  }

  async function signInAnon() {
    const result = await signInAnonymously(auth)

    localStorage.setItem("user", JSON.stringify(result));
    refresh()
  }

  async function login(method) {

    switch (method) {
      case "google":
        signWithGoogle();
        break;
    
      default:
        signInAnon();
        break;
    }
    
    setLoading(true)
    
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }

  return (
    <div className="login">
      <span>Login to play</span>
     
      <LoadingButton
          onClick={()=>login("google")}
          loading={loading}
          loadingPosition="start"
          startIcon={<FaGoogle />}
          variant="contained"
      >
          Login with Google
      </LoadingButton>

      <LoadingButton
          onClick={()=>login("anon")}
          loading={loading}
          loadingPosition="start"
          startIcon={<CgProfile />}
          variant="contained"
      >
          Play anonymously
      </LoadingButton>



    </div>
  )
}

Login.propTypes = {
  refresh: PropTypes.func
}


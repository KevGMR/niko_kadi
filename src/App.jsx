import { useContext } from 'react';
import './App.css'
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom";


import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context';
import { ref, onChildChanged, onValue } from "firebase/database";
import { db } from './firebase/firebase';
import Game from './pages/Game';

function App() {
  const { gameID, setGame } = useContext(AppContext);

  const gamesRef = ref(db, 'game_sessions/' + gameID);

  onChildChanged(gamesRef, () => {
    onValue(gamesRef, (snapshot) => {
      const x = snapshot.val();
      console.log(x);
      setGame(x);
    });

  });



  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Home />} />
        <Route path="game/:id" element={<Game />} />
      </Route>
    </Routes>
  )
}

export default App

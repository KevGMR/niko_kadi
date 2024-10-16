import { onValue, ref } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase/firebase";
import { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { Container } from "@mui/material";


export default function Game() {
  const { id } = useParams();
  const { setGame, setGameID } = useContext(AppContext);
  const navigate = useNavigate(AppContext)



  useEffect(() => {
    const gameRef = ref(db, 'game_sessions/' + id);

    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);

      if (data === null) {
        localStorage.setItem('game_id', null);
        setGameID(null)
        navigate('/');
      }

      setGame(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  return (
    <Container className="game">
      <Container className="game-top">
        <Container className="left">left</Container>
        <Container className="right">right</Container>
      </Container>
      <Container className="game-bottom">
        <Container className="left">left</Container>
        <Container className="right">right</Container>
      </Container>
    </Container>
  )
}


import { onValue, ref, update } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase/firebase";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import { Container } from "@mui/material";
import Table from '../components/Game/Table';
import Players from '../components/Game/Players';
import Hand from '../components/Game/Hand';
import Options from '../components/Game/Options';



export default function Game() {
  const { id } = useParams();

  const { setGame, setGameID } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")).user;

  if (!id) {
    navigate('/');
  }

  function load() {
    setLoading(true);

    const gameRef = ref(db, 'game_sessions/' + id);

    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();

      console.log(data);

      if (data === null) {
        localStorage.setItem('game_id', null);
        setGameID(null)
        navigate('/');
      }

      const loadedPlayer = data.players.filter((player) => player.id === user.uid);

      // if player had already joined the game then...
      if (loadedPlayer[0]) {
        // console.log(data);

        if (!("hand" in loadedPlayer[0])) {

          const cDeck = JSON.parse(JSON.stringify(data.currentDeck));
          const startingCard = cDeck.splice(-1);
          const array = cDeck.splice(-4); // Removes the last 4 elements

          const playersToAdjust = JSON.parse(JSON.stringify(data.players));

          let index = data.players.findIndex(player => player.id === user.uid);

          const adjustPlayer = playersToAdjust.splice(index, 1)[0];

          adjustPlayer.hand = [...array];

          playersToAdjust.splice(index, 1, adjustPlayer)

          const newGame = {
            ...data,
            currentDeck: cDeck,
            playersDeck: startingCard,
            players: playersToAdjust
          }

          const updates = {};
          updates['/game_sessions/' + id] = newGame;

          return update(ref(db), updates);
        }
      }

      setGame(data);
      setLoading(false);
    });

  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (loading) {
    return (
      <Container className="game">
        loading
      </Container>
    )
  }



  return (
    <Container className="game">
      <Container className="game-top">
        <Container className="left"><Table /></Container>
        <Container className="right"><Players /></Container>
      </Container>
      <Container className="game-bottom">
        <Container className="left"><Hand /></Container>
        <Container className="right"><Options /></Container>
      </Container>
    </Container>
  )
}


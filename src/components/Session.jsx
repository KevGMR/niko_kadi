import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useState, useContext } from "react";

import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { FaPlusMinus, FaRegShareFromSquare } from "react-icons/fa6";

import { db } from '../firebase/firebase'
import { ref, push, set, onValue, update } from "firebase/database";

import { toast } from 'react-toastify';

import { AppContext } from "../context/index";
import { useNavigate } from "react-router-dom";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Session() {

  const user = JSON.parse(localStorage.getItem("user")).user;


  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState("");

  const [createLoading, setCreateLoading] = useState(false);

  const { gameID, setGameID, setGame } = useContext(AppContext);

  const navigate = useNavigate();


  const handleOpen = (text) => {
    setModal(text);
    setOpen(true);
    if (text === "create") createGameSession();
  };

  async function refreshGameID() {
    localStorage.setItem('game_id', null);
    setGameID(null);

    setTimeout(() => {
      createGameSession();
    }, 500);

  }


  async function createGameSession() {
    if (gameID !== null) {
      return toast("You already have a session id")
    }

    setCreateLoading(true);

    const players = [];

    players.push({
      id: user.uid,
      name: user.displayName || "Anonymous",
      photo: user.photoURL,
      hand: [],
      isTurn: true,
      nikoKadi: false
    })

    const createDeck = () => {
      const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
      const ranks = [
        '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
      ];
      const deck = [...ranks.flatMap(rank => suits.map(suit => `${rank} of ${suit}`)), 'Joker', 'Joker'];
      return shuffle(deck);
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };


    try {
      const gameSessionRef = ref(db, 'game_sessions');
      const newSessionRef = push(gameSessionRef);

      setGameID(newSessionRef.key);
      localStorage.setItem('game_id', newSessionRef.key)

      set(newSessionRef, {
        "players": [...players],
        "playingDeck": [],
        "currentDeck": createDeck(),
        "currentTurn": 0,
        "penaltyCount": 0,
        "turnDirection": true,
        "gameOver": false
      })



      toast.success("Game Created Successfully")
      setCreateLoading(false)
    } catch (error) {
      console.log(error);
      toast.error("Error occurred...")
    }
  }

  async function startGame() {
    const gameRef = ref(db, 'game_sessions/' + gameID);

    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();

      setGame(data)

      // updateStarCount(postElement, data);
    });

    navigate(`/game/${gameID}`);
  }

  const handleClose = () => {
    if (createLoading) return console.log("Creating a game")
    setOpen(false);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ text: gameID, title: "Share Game with Friends" })
    } else {
      navigator.clipboard.writeText(gameID);
      toast.success("Code copied to clipboard")
    }
  }

  const [text, setText] = useState("");

  async function joinGame() {
    const gameRef = ref(db, 'game_sessions/' + text);


    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();

      // console.log(data);

      if (data) {
        setGame(data)
        localStorage.setItem("game_id", text);

        const cDeck = JSON.parse(JSON.stringify(data.currentDeck));
        const array = cDeck.splice(-4);

        const playersToAdjust = JSON.parse(JSON.stringify(data.players));

        console.log(playersToAdjust);

        const loadedPlayer = data.players.filter((player) => player.id === user.uid);

        if (!loadedPlayer[0]) {

          const newPlayer = {
            id: user.uid,
            name: user.displayName || "Anonymous",
            photo: user.photoURL || null,
            hand: [...array],
            isTurn: false,
            nikoKadi: false
          }

          playersToAdjust.push(newPlayer);

          const newGame = {
            ...data,
            currentDeck: cDeck,
            players: playersToAdjust
          }

          const updates = {};
          updates['/game_sessions/' + text] = newGame;

          update(ref(db), updates);
          return navigate(`/game/${text}`);

        }


      }

      toast.error("Error occurred...")

      // updateStarCount(postElement, data);
    });


  }


  return (
    <>
      <div className="session">
        <Button variant="outlined" startIcon={<FaPlusMinus />} onClick={() => handleOpen("create")}>
          Create Game
        </Button>
        <Button variant="contained" endIcon={<HiOutlineArrowDownTray />} onClick={() => handleOpen("join")}>
          Join a Game
        </Button>

      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modal === "create" ? "Create a game session" : "Join Game Session"}
          </Typography>
          {
            modal === 'create' && !createLoading && <div>
              <div>

                <p>Your Game id : {gameID} <span><IconButton onClick={() => share()}><FaRegShareFromSquare /></IconButton> </span></p>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}> <Button onClick={() => refreshGameID()}>Get New Game ID</Button> <Button onClick={startGame}>Start</Button></div>

              </div>
            </div>
          }
          {
            modal === "join" && <div>

              <TextField onChange={(e) => setText(e.target.value)} id="outlined-basic" label="Enter game id to join" variant="outlined" />

              <Button onClick={joinGame}>Load Game</Button>

              <a href="https://docs.google.com/presentation/d/1Y58iK2ynbll4x_JMkdvbTgv3bQQ7fz_1bzZHDm5gBb0/edit?usp=sharing">Link to presentation</a>
            </div>
          }
        </Box>
      </Modal>
    </>
  )
}


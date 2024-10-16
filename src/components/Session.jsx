import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useState, useContext } from "react";

import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { FaPlusMinus, FaRegShareFromSquare } from "react-icons/fa6";

import { db } from '../firebase/firebase'
import { ref, push, set, onValue } from "firebase/database";

import { ToastContainer, toast } from 'react-toastify';

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

  const user = JSON.parse(localStorage.getItem("user")).user.uid;


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
      id: user,
      "hand": [],
      isTurn: true
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
        "currentTurn": user,
        "penaltyCount": 0,
        "turnDirection": 1,
        "nikoKadiDeclared": false,
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

  const share = async () => {
    await navigator.share(gameID)
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
        <ToastContainer />
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
        </Box>
      </Modal>
    </>
  )
}


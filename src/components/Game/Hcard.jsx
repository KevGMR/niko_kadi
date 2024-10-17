import { Container } from "@mui/material";
import PropTypes from "prop-types"
import { useContext } from "react";

import { FaHeart } from "react-icons/fa";
import { ImSpades, ImDiamonds } from "react-icons/im";
import { TbClubsFilled } from "react-icons/tb";
import { AppContext } from "../../context";
import { toast } from "react-toastify";

export default function Card({ card }) {

  const { game } = useContext(AppContext)
  const gameID = localStorage.getItem("game_id");
  const user = JSON.parse(localStorage.getItem("user")).user

  const rank = card.split(' of ')[0];
  const suite = card.split(' of ')[1];

  const divs = document.querySelectorAll('.hcard');

  divs.forEach((div, index) => {
    const offset = index * 40; // Calculate the 20px offset for each div
    div.style.top = `${0}px`;
    div.style.left = `${offset}px`;
  });


  const specs = {
    Clubs: { color: "black", icon: <TbClubsFilled style={{ color: "black" }} /> },
    Spades: {
      color: "black", icon: <ImSpades style={{ color: "black" }} />
    },
    Hearts: { color: "red", icon: <FaHeart style={{ color: "red" }} /> },
    Diamonds: { color: "red", icon: <ImDiamonds style={{ color: "red" }} /> },
  }


  async function playCard() {
    if (!canPlayCard(suite, rank)) {
      toast.error("You can't play that card")
      return;
    }

    play(card)


    if (isPenaltyCard(rank)) {
      const pen = getPenaltyValue(rank);

      const newData = {
        ...game,
        penaltyCount: game.penaltyCount + pen,
      }

      const updates = {};
      updates['/game_sessions/' + gameID] = newData;
      return;
    }
    if (isJack(rank)) {
      console.log("skip player");
      console.log(nextPlayer(1, true));
      return;
    }
    if (isKing(rank)) {
      console.log("reverse game play");
      console.log(nextPlayer(0, false));
      return;
    }

    if (isAce(rank)) {
      console.log("pick a color");
      return;
    }
  }

  async function play(card) {
    const gameObjToUse = JSON.parse(JSON.stringify(game));

    const userToEdit = gameObjToUse.players.filter((p) => p.id === user.uid)[0];

    userToEdit.hand.splice(userToEdit.hand.indexOf(card), 1)
    gameObjToUse.playersDeck.push(card);

    const updates = {};
    updates['/game_sessions/' + gameID] = gameObjToUse;
    return;
  }


  const canPlayCard = (suite, rank) => {
    const topCard = game.playersDeck[game.playersDeck.length - 1].split(' of ');

    return suite === topCard[1] || rank === topCard[0] || rank === "Joker" || rank === "A" || topCard[1] === "Joker";
  };

  const isPenaltyCard = (rank) => {
    return rank === '2' || rank === '3' || rank === 'Joker';
  };

  // Returns the penalty value of a card
  const getPenaltyValue = (rank) => {
    if (rank === '2') return 2;
    if (rank === '3') return 3;
    if (rank === 'Joker') return 5;
    return 0;
  };


  function nextPlayer(skip = 0, turnDirection) {
    const gameObjToUse = JSON.parse(JSON.stringify(game));


    // Move forward or backward depending on `isForward`
    if (turnDirection) {
      gameObjToUse.currentTurn += (1 + skip);
    } else {
      gameObjToUse.currentTurn -= (1 + skip);
    }

    // Ensure cyclic behavior (wrap around the list)
    if (gameObjToUse.currentTurn >= gameObjToUse.players.length) {
      gameObjToUse.currentTurn = gameObjToUse.currentTurn % gameObjToUse.players.length; // forward wrapping
    } else if (game.currentTurn < 0) {
      gameObjToUse.currentTurn = (gameObjToUse.currentTurn + gameObjToUse.players.length) % gameObjToUse.players.length; // reverse wrapping
    }

    return gameObjToUse.currentTurn;  // Return the current user after moving
  }


  // Checks if the card is a Jack
  const isJack = (rank) => rank === 'J';

  // Checks if the card is a King
  const isKing = (rank) => rank === 'K';

  // Checks if the card is an Ace
  const isAce = (rank) => rank === 'A';

  if (rank === "Joker") {
    return (
      <Container onClick={() => { playCard() }} className="hcard">
        <Container className="card-body joker">
          Joker
        </Container>

      </Container>
    )
  }

  return (
    <Container onClick={() => { playCard() }} className="hcard">
      <Container className="body" style={{
        borderColor: specs[suite].color
      }}>

      </Container>
      <Container className="rank">
        <span>{rank}</span>
        {specs[suite].icon}
      </Container>
      <Container className="lower-rank">
        <span>{rank}</span>
        {specs[suite].icon}
      </Container>

    </Container>
  )
}

Card.propTypes = {
  card: PropTypes.string,
}

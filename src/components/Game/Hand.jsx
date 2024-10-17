import { useContext } from "react";
import { AppContext } from "../../context";
import { Container } from "@mui/material";

import Card from "./Hcard"

export default function Hand() {
  const { game } = useContext(AppContext);

  const user = JSON.parse(localStorage.getItem("user")).user;

  const player = game.players.filter((p) => p.id === user.uid)[0];

  async function playCard(card) {
    console.log(card);

  }

  return (
    <>
      <Container className="playing deck">
        <p>Current hand</p>
        <Container className="playing-deck-container">
          {
            player.hand?.map((card, index) => {
              return (
                <Card onClick={() => playCard(card)} key={index} card={card} />
              )
            })
          }
        </Container>
      </Container>
    </>
  )
}


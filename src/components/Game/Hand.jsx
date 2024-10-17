import { useContext } from "react";
import { AppContext } from "../../context";
import { Container } from "@mui/material";

import Card from "./Hcard"

export default function Hand() {
  const { game } = useContext(AppContext);

  const user = JSON.parse(localStorage.getItem("user")).user;

  const player = game.players.filter((p) => p.id === user.uid)[0];

  return (
    <>
      <Container className="playing deck">
        <p>Playing Deck</p>
        <Container className="playing-deck-container">
          {
            player.hand?.map((card, index) => {
              return (
                <Card key={index} card={card} />
              )
            })
          }
        </Container>
      </Container>
    </>
  )
}


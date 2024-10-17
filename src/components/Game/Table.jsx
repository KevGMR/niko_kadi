import { useContext } from "react"
import { AppContext } from "../../context"
import { Container } from "@mui/material";

import Card from './Card'

import cardbehind from "../../assets/backofcard.jpeg"

export default function Table() {
  const { game } = useContext(AppContext)

  return (
    <Container className="table">
      <Container className="drawing deck">
        <p>Drawing Deck</p>
        <img src={cardbehind} />

      </Container>
      <Container className="playing deck">
        <p>Playing Deck</p>
        <Container className="playing-deck-container">
          {
            game.playersDeck?.map((card, index) => {
              return (
                <Card key={index} card={card} />
              )
            })
          }
        </Container>
      </Container>
    </Container>
  )
}
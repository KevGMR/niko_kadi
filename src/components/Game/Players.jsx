import { useContext } from "react"
import { AppContext } from "../../context"
import { Avatar, Container } from "@mui/material";

export default function Players() {
  const { game } = useContext(AppContext);

  return (
    <>
      <Container className="penalty">
        Accumulated Penalty: {game.penaltyCount}
      </Container>
      <Container className="player">
        {
          game.players.map((player, index) => {
            return <Container className="oneplayer" key={index}> <Avatar src={`${player.photo}`} sx={{ width: 56, height: 56 }} alt={player.name} /> {player.name}</Container>
          })
        }

      </Container>
    </>

  )
}


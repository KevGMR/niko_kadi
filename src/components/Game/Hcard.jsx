import { Container } from "@mui/material";
import PropTypes from "prop-types"

import { FaHeart } from "react-icons/fa";
import { ImSpades, ImDiamonds } from "react-icons/im";
import { TbClubsFilled } from "react-icons/tb";

export default function Card({ card }) {

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

  if (rank === "Joker") {
    return (
      <Container className="hcard">
        <Container className="card-body">
          Joker
        </Container>

      </Container>
    )
  }

  return (
    <Container className="hcard">
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

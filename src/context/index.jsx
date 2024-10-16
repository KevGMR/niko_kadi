import { createContext, useState } from "react";
import PropTypes from 'prop-types'

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [gameID, setGameID] = useState(localStorage.getItem("game_id"));

  const [game, setGame] = useState()

  return (
    <AppContext.Provider
      value={{
        gameID,
        setGameID,
        game,
        setGame
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.any,
}
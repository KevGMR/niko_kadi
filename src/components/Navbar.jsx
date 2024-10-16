import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";

export default function Navbar({ page, refresh }) {
  console.log(page);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const user = localStorage.getItem("user");

  const username = user ? JSON.parse(user).user.displayName : "A";
  const profilePic = user ? JSON.parse(user).user.photoURL : null;


  function handleLogout() {
    localStorage.clear();

    handleClose();
    refresh()
  }


  if (user) {
    return (
      <>
        <Box className="navbar">
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar src={`${profilePic}`} sx={{ width: 56, height: 56 }} alt={username} />

            </IconButton>

          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled onClick={handleClose}>
            <Avatar /> Profile

          </MenuItem>
          <MenuItem disabled onClick={handleClose}>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem> */}
          <MenuItem onClick={() => {
            handleLogout()
          }}>
            <ListItemIcon>
              <BiLogOut fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </>
    )
  }

}

Navbar.propTypes = {
  page: PropTypes.string,
  refresh: PropTypes.func
}
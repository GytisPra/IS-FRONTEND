import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { Drawer, ListItemButton, ListItemText, List } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../theme";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Rangovai
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="profile"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={anchorEl !== null}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => (window.location.href = "/update-profile")}
                >
                  Paskyra
                </MenuItem>
                <MenuItem onClick={() => (window.location.href = "/user")}>
                  Renginiai
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            marginTop: 2,
            padding: 2,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ marginBottom: 2, textAlign: "center" }}
          >
            Navigacija :)
          </Typography>
          <List>
            {[
              { text: "Mano profilis", href: "/update-profile" },
              { text: "Renginių naršyklė", href: "/user" },
              { text: "Ateinantys renginiai", href: "/my-events" },
              { text: "Mano Bilietai", href: "/tickets" },
              { text: "Tapti savanoriu!", href: "/volunteer" },
              { text: "Mano savanorystės", href: "/my-applications" },
              { text: "Sukūrti Renginį", href: "/event-management" },
              { text: "Ieškoti savanorių", href: "/organiser" },
            ].map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => (window.location.href = item.href)}
                sx={{
                  marginBottom: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{ textAlign: "center" }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

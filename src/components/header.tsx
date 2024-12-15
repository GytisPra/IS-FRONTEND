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
import { logout } from "../userService";
import { user } from "../home/user";
import { useEffect } from "react";
import { getCurrentUser } from "../volunteers/services/volunteerActions";
import { User } from "../volunteers/objects/types";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUser, setUser] = useState<User | null>(null);
  const [loadingRole, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const checkFirstTimeLogin = async () => {
      if (!user) {
        console.log("No user is currently signed in.");
        return;
      }
    };

    checkFirstTimeLogin();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.id) {
        console.log("No user is currently signed in.");
        setLoadingUser(false);
        return;
      }

      try {
        const { data, error } = await getCurrentUser(user.id);
        if (error) {
          setUser(null);
        } else if (data) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        setUser(null);
        console.error(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { text: "Mano profilis", href: "/update-profile" },
    {
      text: "Renginių naršyklė",
      href: "/event-list",
      roles: ["user"],
    },
    { text: "Mano Bilietai", href: "/tickets", roles: ["user"] },
    {
      text: "Savanorystė",
      href: "/volunteers/events",
      roles: ["volunteer"],
    },
    {
      text: "Savanorystės statistika",
      href: "/volunteers/statistics",
      roles: ["volunteer"],
    },
    { text: "Renginų tvarkyklė", href: "/event-management", roles: ["admin"] },
    { text: "Ieškoti savanorių", href: "/organiser", roles: ["admin"] },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {currentUser && (
              <>
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
              </>
            )}
            {currentUser && (
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
                  <MenuItem onClick={logout}>Atsijungti</MenuItem>
                </Menu>
              </div>
            )}
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
            {navigationItems
              .filter(
                (item) =>
                  !item.roles || 
                  (currentUser && item.roles.includes(currentUser.role) && currentUser.is_email_verified)
              )
              .map((item, index) => (
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

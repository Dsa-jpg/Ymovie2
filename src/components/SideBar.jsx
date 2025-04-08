// SideBar.jsx
import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const SideBar = () => (
  <Sidebar>
    <Menu>
      <MenuItem component={<Link to="/" />}>Home</MenuItem>
      <MenuItem component={<Link to="/films" />}>Films</MenuItem>
      <MenuItem component={<Link to="/series" />}>Series</MenuItem>
      <MenuItem component={<Link to="/anime" />}>Anime</MenuItem>
      <MenuItem component={<Link to="/settings" />}>Settings</MenuItem>
    </Menu>
  </Sidebar>
);

export default SideBar;

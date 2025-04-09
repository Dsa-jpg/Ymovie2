import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import './SideBar.css';



const SideBar = () => {

  const buildVersion = localStorage.getItem('build_version'); 


  return (
    <Sidebar className="custom-sidebar">
      <div className="sidebar-header">
        <div style={{fontFamily: "cursive", position: "sticky", bottom: 0, padding:"20px", textAlign:"center", fontSize:"16px"}}>Ymovie2</div>
      </div>

      <Menu className="sidebar-menu">
        <MenuItem style={{fontFamily: "cursive"}} component={<Link to="/" />}>Home</MenuItem>
        <MenuItem style={{fontFamily: "cursive"}} component={<Link to="/films" />}>Films</MenuItem>
        <MenuItem style={{fontFamily: "cursive"}} component={<Link to="/series" />}>Series</MenuItem>
        <MenuItem style={{fontFamily: "cursive"}} component={<Link to="/anime" />}>Anime</MenuItem>
        <MenuItem style={{fontFamily: "cursive"}} component={<Link to="/settings" />}>Settings</MenuItem>
      </Menu>

      <div className="sidebar-footer">
        <div className="build-info" style={{fontFamily: "cursive"}}> Build {buildVersion}</div>
      </div>
    </Sidebar>
  );
};

export default SideBar;

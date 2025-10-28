import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import xdcLogo from "../assets/images/xdc-network-logo.svg";
import { NavLink } from "react-router";

const Header = () => {
  return (
    <header className="g-0 row top-header sticky-top bg-white">
      <div className="d-flex align-items-center justify-content-between col-12 p-3 gap-3 text-end">
        <div className="logo-wrapper">
          <img src={xdcLogo} alt="XDC-Logo" />
        </div>
        <div className="d-flex gap-3">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/market">Markets</NavLink>
          <NavLink to="/governance">Governance</NavLink>
          <NavLink to="/savings">Savings</NavLink>
        </div>
        <ConnectButton
          label="Connect Wallet"
          chainStatus="icon"
          showBalance={false}
          accountStatus="address"
        />
      </div>
    </header>
  );
};

export default Header;

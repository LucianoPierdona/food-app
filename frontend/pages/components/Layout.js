import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";

import { Nav, NavItem } from "reactstrap";
import { Container } from "next/app";
import AppContext from "../../context/AppContext";
import { logout } from "../../lib/auth";

export default function Layout(props) {
  const title = "Food App";
  const { user, setUser } = useContext(AppContext);

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3" />
      </Head>
      <header>
        <style jsx>
          {`
            a {
              color: #fff;
              transition: color 0.2s;
            }
            a:hover {
              color: blue;
            }
            .flex {
              display: flex;
            }
          `}
        </style>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/">
              <a className="navbar-brand">Home</a>
            </Link>
          </NavItem>

          <div className="ml-auto flex">
            <NavItem className="ml-auto">
              {user ? (
                <h5>{user.username}</h5>
              ) : (
                <Link href="/register">
                  <a className="nav-link"> Sign up</a>
                </Link>
              )}
            </NavItem>

            <NavItem className="ml-auto">
              {user ? (
                <Link href="/">
                  <a
                    className="nav-link"
                    onClick={() => {
                      logout();
                      setUser(null);
                    }}
                  >
                    Logout
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="nav-link">Sign In</a>
                </Link>
              )}
            </NavItem>
          </div>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
}

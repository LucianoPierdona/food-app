import Cookie from "js-cookie";
import axios from "axios";
import { Router } from "next/router";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Register
export const registerUser = (username, email, password) => {
  // prevent function to run on the server
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then((res) => {
        Cookie.set("token", res.data.jwt);

        // resolve the promise to set loading to false in signup form
        resolve(res);
        // redirect back to home page for restaurants selection
        Router.push("/");
      })
      .catch((err) => {
        // reject the promise and pass the error object back to the form
        reject(err);
      });
  });
};

// Login
export const login = (identifier, password) => {
  // prevent function to run on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local`, { identifier, password })
      .then((res) => {
        Cookie.set("token", res.data.jwt);

        // resolve the promise to set loading to false in SignIn form
        resolve(res);
        // Redirect back to home page for restaurants selection
        Router.push("/");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Logout
export const logout = () => {
  // remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  // redirect to home page
  Router.push("/");
};

// Higher Order Component to wrap our pages and logout simultaneously logged in tabs
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};

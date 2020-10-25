import React from "react";
import App from "next/app";
import Head from "next/head";
import Layout from "./components/Layout";
import withData from "../lib/apollo";
import Cookie from "js-cookie";
import fetch from "isomorphic-fetch";
import AppContext from "../context/AppContext";

class MyApp extends App {
  state = {
    user: null,
    cart: { items: [], total: 0 },
  };

  componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }

    const token = Cookie.get("token");
    const cart = Cookie.get("cart");
    console.log(cart);

    if (typeof cart === "string" && cart !== "undefined") {
      console.log("foyd");
      JSON.parse(cart).forEach((item) => {
        this.setState({
          cart: { items: cart, total: item.price * item.quantity },
        });
      });
    }

    if (token) {
      // authenticate the token on the server and place set user object
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookie.remove("token");
          this.setState({ user: null });
          return null;
        }
        const user = await res.json();
        this.setUser(user);
      });
    }
  }

  setUser = (user) => {
    this.setState({ user });
  };

  addItem = (item) => {
    let { items } = this.state.cart;
    // check for item already in cart
    const newItem = items.find((i) => i.id === item.id);

    if (!newItem) {
      // set quantity to 1
      item.quantity = 1;
      this.setState(
        {
          cart: {
            items: [...items, item],
            total: this.state.cart.total + item.price,
          },
        },
        () => Cookie.set("cart", this.state.items)
      );
    } else {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.id === newItem.id
                ? Object.assign({}, item, { quantity: item.quantity + 1 })
                : item
            ),
            total: this.state.cart.total + item.price,
          },
        },
        () => Cookie.set("cart", this.state.items)
      );
    }
  };

  removeItem = (item) => {
    let { items } = this.state.cart;

    const newItem = items.find((i) => i.id === item.id);

    if (newItem.quantity > 1) {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.id === newItem.id
                ? Object.assign({}, item, { quantity: item.quantity - 1 })
                : item
            ),
            total: this.state.cart.total - item.price,
          },
        },
        () => Cookie.set("cart", this.state.items)
      );
    } else {
      const items = [...this.state.cart.items];
      const index = items.findIndex((i) => i.id === newItem.id);

      items.splice(index, 1);
      this.setState(
        { cart: { items, total: this.state.cart.total - item.price } },
        () => Cookie.set("cart", this.state.items)
      );
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppContext.Provider
        value={{
          user: this.state.user,
          isAuthenticated: !!this.state.user,
          setUser: this.setUser,
          cart: this.state.cart,
          addItem: this.addItem,
          removeItem: this.removeItem,
        }}
      >
        <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    );
  }
}

export default withData(MyApp);

import React, { useState } from "react";
import { Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import RestaurantList from "./components/RestaurantList";

export default function Home() {
  const [query, setQuery] = useState("");
  return (
    <div className="container-fluid">
      <Row>
        <Col>
          <div className="search">
            <InputGroup>
              <InputGroupAddon addonType="append">Search</InputGroupAddon>
              <Input
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                value={query}
              />
            </InputGroup>
          </div>
          <RestaurantList search={query} />
        </Col>
      </Row>
      <style jsx>
        {`
          .search {
            margin: 20px;
            width: 500px;
          }
        `}
      </style>
    </div>
  );
}

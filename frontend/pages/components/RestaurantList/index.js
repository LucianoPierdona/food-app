import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

const QUERY = gql`
  {
    restaurants {
      id
      name
      description
      image {
        url
      }
    }
  }
`;

function RestaurantList(props) {
  const { loading, error, data } = useQuery(QUERY);
  if (error) return "Error Loading Restaurants";
  if (loading) return <h1>Loading...</h1>;
  if (data.restaurants && data.restaurants.length) {
    const searchQuery = data.restaurants.filter((query) =>
      query.name.toLowerCase().includes(props.search)
    );
    if (searchQuery.length !== 0) {
      return (
        <Row>
          {searchQuery.map((res) => (
            <>
              <Col xs="6" sm="4" key={res.id}>
                <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
                  <CardImg
                    top
                    style={{ height: 250 }}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${res.image[0].url}`}
                  />
                  <CardBody>
                    <CardTitle>{res.name}</CardTitle>
                    <CardText>{res.description}</CardText>
                  </CardBody>
                  <div className="card-footer">
                    <Link
                      as={`/restaurants/${res.id}`}
                      href={`/restaurants?id=${res.id}`}
                    >
                      <a className="btn btn-primary">View</a>
                    </Link>
                  </div>
                </Card>
              </Col>
            </>
          ))}

          <style jsx global>
            {`
              a {
                color: #fff;
              }
              a:link {
                text-decoration: none;
                color: #fff;
              }
              a:hover {
                color: #fff;
              }
              .card-columns {
                column-count: 3;
              }
            `}
          </style>
        </Row>
      );
    } else {
      return <h1>No Restaurants Found</h1>;
    }
  }

  return <h5>Add Restaurants</h5>;
}

export default RestaurantList;

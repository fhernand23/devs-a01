import { Container, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { useEffect } from "react";
import SessionStore from "../../stores/SessionStore";
import { ROUTES } from "../../utils/constants";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (SessionStore.isLoggedIn) {
      navigate(ROUTES.DASHBOARD);
    }
  }, []);

  return (
    <Container className="home">
      <Typography
        variant="h2"
        className="custom-header"
        style={{ fontWeight: "bold" }}
      >
        <strong>Welcome!</strong>
      </Typography>
      <br />
      <br />
      <Typography variant="h4" className="custom-subheader">
        The ultimate repository for Discrete Event Systems Specification (DEVS)
        models.
        <b> Easily upload and validate your DEVS models.</b>
      </Typography>
      <br />
      <br />
      <Typography variant="h4" className="custom-subheader">
        <Link to="/register" style={{ color: theme.palette.primary.light }}>
          Join our community
        </Link>{" "}
        of DEVS enthusiasts and take your modeling to the next level.
      </Typography>
      <br />
      <br />
      <Typography variant="h4" className="custom-subheader">
        <Link to="/login" style={{ color: theme.palette.primary.light }}>
          Login
        </Link>{" "}
        into your account.
      </Typography>
    </Container>
  );
};

export default Home;

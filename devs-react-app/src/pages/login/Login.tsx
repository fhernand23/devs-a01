import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import LoginStore from "../../stores/LoginStore";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import SessionStore from "../../stores/SessionStore";
import { IconButton, InputAdornment, useTheme } from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ROUTES } from "../../utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const togglePassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (SessionStore.isLoggedIn) {
      navigate(ROUTES.DASHBOARD);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await LoginStore.login(username, password);
  };

  const inputStyle = {
    WebkitBoxShadow: `0 0 0 1000px ${
      theme.palette.mode === "dark" ? "#261875" : "#eae8fa"
    } inset`,
  };

  return (
    <Container maxWidth="sm" sx={{ py: 15 }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <div>
          <Typography component="h1" variant="h5">
            <b>Welcome back</b>
          </Typography>
        </div>
        <Box component="form" noValidate width={"100%"}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{ style: inputStyle }}
          />
          <TextField
            id="password"
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ style: inputStyle }}
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ marginRight: "5px" }} position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined />
                    ) : (
                      <VisibilityOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Grid container justifyContent="center">
          <LoadingButton
            variant="contained"
            color="primary"
            sx={{ mb: 5, px: 5, textTransform: "none" }}
            onClick={handleSubmit}
            loading={LoginStore.isLoading}
          >
            Login
          </LoadingButton>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Link to="#" style={{ color: theme.palette.primary.light }}>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link to="/register" style={{ color: theme.palette.primary.light }}>
              {"Don't have an account? Register now"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default observer(Login);

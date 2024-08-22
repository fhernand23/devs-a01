import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SessionStore from "../../stores/SessionStore";
import UserStore from "../../stores/UserStore";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { CountrySelect } from "./CountrySelect";
import { toast } from "react-toastify";
import {
  ROUTES,
  TOAST_PROPS,
  emailPattern,
  passwordPattern,
  occupations,
} from "../../utils/constants";
import { validateEmail } from "../../utils/validation";

const validPassword = `
  Password must be at least 8 characters long
  and include at least one uppercase letter,
  one lowercase letter, one digit, and one special character
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [occupation, setOccupation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((show) => !show);

  const toggleConfirmPassword = () => setShowConfirmPassword((show) => !show);

  useEffect(() => {
    if (SessionStore.isLoggedIn) {
      navigate(ROUTES.DASHBOARD);
    }
  }, []);

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [universityError, setUniversityError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const validatePassword = (passwordInput: string) => {
    if (!password) {
      return "Password is required";
    }

    if (!passwordPattern.test(passwordInput)) {
      return validPassword;
    }

    if (passwordInput !== confirmPassword) {
      return "Passwords not match";
    }

    return "";
  };

  const validateConfirmPassword = (confirmPasswordInput: string) => {
    if (confirmPasswordInput !== password) {
      return "Passwords not match";
    }

    return "";
  };

  const validateRequired = (field: string, fieldName: string) => {
    if (!field) {
      return `${fieldName} is required`;
    }

    return "";
  };

  const isValid = () => {
    const emailValidationMessage = validateEmail(email);
    const passwordValidationMessage = validatePassword(password);
    const confirmPasswordValidationMessage =
      validateConfirmPassword(confirmPassword);

    const passwordValidation =
      passwordValidationMessage === "" &&
      confirmPasswordValidationMessage === "";

    return (
      !!username &&
      emailValidationMessage === "" &&
      passwordValidation &&
      !!firstName &&
      !!university
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid()) {
      toast.error(
        "Something went wrong. Please check the information entered.",
        TOAST_PROPS
      );
      setUserNameError(validateRequired(username, "Username"));
      setEmailError(validateEmail(email));
      setPasswordError(validatePassword(password));
      setUniversityError(validateRequired(username, "University"));
      setFirstNameError(validateRequired(firstName, "First name"));
      return;
    }

    await UserStore.registerUser(
      email,
      username,
      password,
      university,
      occupation,
      country,
      firstName,
      lastName
    );
  };

  return (
    <Container sx={{ py: 15 }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={3}
        justifyItems="center"
        sx={{ width: "md" }}
      >
        <div
          className="d-flex flex-column"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Typography variant="h5" align="center" sx={{ mt: 1, mb: 1 }}>
            <b>Let's begin the adventure</b>
          </Typography>
        </div>
        <Grid item sx={{ maxWidth: "md" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First name"
                type="text"
                value={firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFirstName(value);
                  setFirstNameError(validateRequired(value, "First name"));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setFirstNameError(validateRequired(value, "First name"));
                }}
                helperText={
                  firstNameError ? firstNameError : "(*) First name is required"
                }
                error={Boolean(firstNameError)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  setUsername(value);
                  setUserNameError(validateRequired(value, "Username"));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setUserNameError(validateRequired(value, "Username"));
                }}
                required
                fullWidth
                sx={{ mb: 2 }}
                error={Boolean(userNameError)}
                helperText={
                  userNameError ? userNameError : "(*) Username is required"
                }
                inputProps={{
                  autocomplete: "new-password",
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                type="email"
                value={email}
                inputProps={{
                  autocomplete: "new-password",
                  form: {
                    autocomplete: "off",
                  },
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  setEmailError(validateEmail(value));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setEmailError(validateEmail(value));
                }}
                helperText={emailError ? emailError : "(*) Email is required"}
                required
                fullWidth
                error={Boolean(emailError)}
                sx={{ mb: 2 }}
                autoComplete="off"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setPasswordError(validatePassword(value));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setPasswordError(validatePassword(value));
                }}
                required
                fullWidth
                sx={{ mb: 2, width: "250px" }}
                error={Boolean(passwordError)}
                helperText={passwordError ? passwordError : null}
                inputProps={{
                  autocomplete: "new-password",
                  form: {
                    autocomplete: "off",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
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
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);
                  setPasswordError(validateConfirmPassword(value));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setPasswordError(validateConfirmPassword(value));
                }}
                required
                fullWidth
                error={Boolean(passwordError)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete="off"
              />
            </Grid>
          </Grid>

          <CountrySelect setCountry={setCountry} country={country} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="University"
                type="text"
                value={university}
                onChange={(e) => {
                  const value = e.target.value;
                  setUniversity(value);
                  setUniversityError(validateRequired(value, "University"));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setUniversityError(validateRequired(value, "University"));
                }}
                required
                fullWidth
                sx={{ mb: 2 }}
                error={Boolean(universityError)}
                helperText={
                  universityError
                    ? universityError
                    : "(*) University is required"
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="grouped-demo"
                options={occupations}
                getOptionLabel={(option) => option.title}
                onChange={(event, newValue) => {
                  setOccupation(newValue?.title as string);
                }}
                fullWidth
                sx={{ mb: 2 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose an occupation"
                    value={occupation || ""}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 6, px: 6, textTransform: "none" }}
              onClick={handleRegister}
              disabled={!isValid()}
            >
              Register
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Typography align="center">
            Already have an account?{" "}
            <Link
              component="button"
              variant="body1"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Grid,
  Autocomplete,
} from "@mui/material";
import { User } from "../entities/user";
import UserStore from "../stores/UserStore";
import { CountrySelect } from "../pages/register/CountrySelect";
import { occupations } from "../utils/constants";
import { validateEmail } from "../utils/validation";

interface AddEditUserProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const AddEditUser: React.FC<AddEditUserProps> = ({ open, onClose, user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [occupation, setOccupation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName ? user.lastName : "");
      setEmail(user.email);
      setUsername(user.username);
      setCountry(user.country ? user?.country : "");
      setUniversity(user.university);
      setOccupation(user.occupation ? user.occupation : "");
      setPassword(user.password);
      setRole(user.role);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setUsername("");
      setCountry("");
      setUniversity("");
      setOccupation("");
      setPassword("");
      setRole("");
    }
  }, [user]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("university", university);
    formData.append("country", country);
    formData.append("occupation", occupation);
    formData.append("password", password);
    formData.append("role", role);

    if (user) {
      await UserStore.updateUser(formData, user.id);
    } else {
      await UserStore.uploadUser(formData);
    }

    onClose();
    cleanModal();
  };

  const cleanModal = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setCountry("");
    setUniversity("");
    setOccupation("");
    setRole("");
    setEmailError("");
  };

  const isValid = () => {
    const emailValidationMessage = validateEmail(email);

    return (
      !!username &&
      emailValidationMessage === "" &&
      !!firstName &&
      !!university
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
      <Divider style={{ borderColor: "gray" }} />
      <DialogContent
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
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
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                }}
                required
                helperText={"(*) First name is required"}
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
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                }}
                required
                fullWidth
                sx={{ mb: 2 }}
                helperText={"(*) Username is required"}
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
                sx={{ mb: 2 }}
                error={Boolean(emailError)}
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
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                }}
                required
                fullWidth
                helperText={"(*) University is required"}
                sx={{ mb: 2 }}
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
                value={occupation ? { title: occupation, id: -1 } : null}
                fullWidth
                sx={{ mb: 2 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose an occupation"
                    value={occupation}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            cleanModal();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!isValid()}
        >
          {user ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditUser;

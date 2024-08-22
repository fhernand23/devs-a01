import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import UserStore from "../../stores/UserStore";
import { Create, DeleteForever, PersonAdd, Search } from "@mui/icons-material";
import { Button } from "@mui/material";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import { User } from "../../entities/user";
import AddEditUser from "../../components/AddEditUser";

export const UsersTable = () => {
  const theme = useTheme();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addUser, setAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getUsers = async () => {
    const users = await UserStore.getUsers();
    setFilteredUsers(users);
    setDataLoaded(true);
  };

  useEffect(() => {
    if (!dataLoaded) getUsers();
  }, [dataLoaded]);

  const filterUsers = (users: User[], searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return users.filter((user) => {
      const normalizedfirstName = user.firstName.toLowerCase();
      const normalizedlastName = user.lastName?.toLowerCase();
      const normalizedEmail = user.email.toLowerCase();
      const normalizedUsername = user.username.toLowerCase();
      const normalizedRole = user.role.toLowerCase();

      return (
        normalizedfirstName.includes(normalizedSearchTerm) ||
        normalizedlastName?.includes(normalizedSearchTerm) ||
        normalizedEmail.includes(normalizedSearchTerm) ||
        normalizedUsername.includes(normalizedSearchTerm) ||
        normalizedRole.includes(normalizedSearchTerm)
      );
    });
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(UserStore.users);
    }
    const filteredUsers = filterUsers(UserStore.users, searchTerm);
    setFilteredUsers(filteredUsers);
  }, [searchTerm, UserStore.users]);

  const handleClick = (userId: number) => {
    const userFinded = UserStore.users.find((user) => user.id === userId);
    if (userFinded) setSelectedUser(userFinded);
    setAddUser(true);
  };

  const handleDelete = async (userId: number) => {
    await UserStore.deleteUser(userId);
    setDataLoaded(false);
  };

  function handleCloseEdit(): void {
    setAddUser(false);
    setSelectedUser(null);
  }

  return (
    <>
      <div className="d-flex flex-col justify-content-between align-items-center h-50 mb-3">
        <div className="d-flex flex-row gap-3">
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Users
          </Typography>
          <Button
            sx={{ height: "100%", width: "25ch" }}
            variant="outlined"
            onClick={() => setAddUser(true)}
            startIcon={<PersonAdd />}
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Add new user
          </Button>
        </div>
      </div>

      <TextField
        fullWidth
        id="input-with-icon-textfield"
        value={searchTerm}
        size="small"
        sx={{ marginBottom: 2 }}
        placeholder="Search on users"
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Paper style={{ padding: 20 }}>
        {!filteredUsers.length && !UserStore.isLoading && (
          <Typography sx={{ textAlign: "center" }}> No users found </Typography>
        )}
        {UserStore.isLoading && <LoadingAnimation text="Loading users" />}
        {dataLoaded && !!filteredUsers.length && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>First name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Deleted</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.firstName ? user.firstName : "-"}
                        </TableCell>
                        <TableCell>
                          {user.lastName ? user.lastName : "-"}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.deleteDate ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => handleClick(user.id)}
                          >
                            <Create />
                          </IconButton>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => handleDelete(user.id)}
                          >
                            <DeleteForever />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
      <AddEditUser
        open={addUser}
        onClose={handleCloseEdit}
        user={selectedUser}
      />
    </>
  );
};

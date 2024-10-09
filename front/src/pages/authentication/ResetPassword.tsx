import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import paths from 'routes/paths';

interface User {
  [key: string]: string;
}

const Login = () => {
  const [user, setUser] = useState<User>({ token: ''});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
        Enter the code
      </Typography>
      
      <Divider sx={{ my: 3 }}>check your email</Divider>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="token"
          name="token"
          type="token"
          value={user.token}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Token"
          autoComplete="token"
          fullWidth
          autoFocus
          required
        />
        <Button type="submit" variant="contained" size="medium" fullWidth>
          Submit
        </Button>
        <Typography
          my={3}
          color="text.secondary"
          variant="body2"
          align="center"
          letterSpacing={0.5}
        >
          <Link href={paths.resetPassword}>{'ResetPassword'}</Link>
        </Typography>
      </Stack>
    </>
  );
};

export default Login;

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import paths from 'routes/paths';
import { useNavigate } from 'react-router-dom';

interface User {
  [key: string]: string;
}

const ForgotPassword = () => {
  const [user, setUser] = useState<User>({ email: '' });
  const [errors, setErrors] = useState<User>({});
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors: User = {};
    let isValid = true;

    if (!user.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Здесь можно добавить логику для отправки данных на сервер
      console.log('Form submitted:', user);
      navigate(paths.resetPassword); // Переход на страницу сброса пароля
    }
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
        Forgot Password
      </Typography>
      
      <Divider sx={{ my: 3 }}>we can help you</Divider>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
          error={!!errors.email}
          helperText={errors.email}
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
          Remember your password? <Link href={paths.login}>{'Login'}</Link>
        </Typography>
      </Stack>
    </>
  );
};

export default ForgotPassword;

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import { MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
  [key: string]: string;
}

const Signup = () => {
  const [user, setUser] = useState<User>({ name: '', country: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<User>({});
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors: User = {};
    let isValid = true;

    if (!user.name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!user.country) {
      errors.country = 'Country is required';
      isValid = false;
    }

    if (!user.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!user.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (user.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!user.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (user.confirmPassword !== user.password) {
      errors.confirmPassword = 'Passwords do not match';
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
      navigate('/'); // Переход на главную страницу
    }
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
        SignUp
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} mt={4} spacing={2} width={1}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<IconifyIcon icon="uim:google" />}
        >
          Signup with Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="uim:apple" />}
        >
          Signup with Apple
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>or Signup with</Divider>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="name"
          name="name"
          type="text"
          value={user.name}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Name"
          autoComplete="name"
          fullWidth
          autoFocus
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <Select
          labelId="country"
          id="country"
          name="country"
          value={user.country}
          onChange={(e) => setUser({ ...user, country: e.target.value as string })}
          variant="filled"
          fullWidth
          required
          error={!!errors.country}
        >
          <MenuItem value="Russia">Russia</MenuItem>
          <MenuItem value="Kazakhstan">Kazakhstan</MenuItem>
          <MenuItem value="China">China</MenuItem>
        </Select>
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
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="current-password"
          fullWidth
          autoFocus
          required
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ opacity: user.password ? 1 : 0 }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="confirm-password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={user.confirmPassword}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Confirm Password"
          autoComplete="confirm-password"
          fullWidth
          autoFocus
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ opacity: user.confirmPassword ? 1 : 0 }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" size="medium" fullWidth sx={{ mt: 1.5 }}>
          Submit
        </Button>
        <Typography
          my={3}
          color="text.secondary"
          variant="body2"
          align="center"
          letterSpacing={0.5}
        >
          Already have an account? <Link href={paths.login}>{'Login'}</Link>
        </Typography>
      </Stack>
    </>
  );
};

export default Signup;
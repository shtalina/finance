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
import { useNavigate } from 'react-router-dom';

interface User {
  [key: string]: string;
}

const ResetPassword = () => {
  const [user, setUser] = useState<User>({ token: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<User>({});
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors: User = {};
    let isValid = true;

    if (!user.token) {
      errors.token = 'Token is required';
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
      navigate(paths.login); // Переход на страницу авторизации
    }
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
          type="text"
          value={user.token}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Token"
          autoComplete="off"
          fullWidth
          autoFocus
          required
          error={!!errors.token}
          helperText={errors.token}
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="new-password"
          fullWidth
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
          autoComplete="new-password"
          fullWidth
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

export default ResetPassword;

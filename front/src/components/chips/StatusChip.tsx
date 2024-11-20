import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';

interface StatusChipProps {
  status: 'income' | 'expense';
}

const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <Chip
      variant="outlined"
      size="small"
      icon={
        <IconifyIcon
          icon="radix-icons:dot-filled"
          sx={(theme) => ({
            color:
              status === 'income'
                ? `${theme.palette.success.main} !important`
                : `${theme.palette.error.main} !important`,
          })}
        />
      }
      label={status}
      sx={{
        pr: 0.65,
        width: 80,
        justifyContent: 'center',
        color:
          status === 'income'
            ? 'success.main'
            : 'error.main',
        letterSpacing: 0.5,
        bgcolor:
          status === 'income'
            ? 'transparent.success.main'
            :'transparent.error.main',
        borderColor:
          status === 'income'
            ? 'transparent.success.main'
            :'transparent.error.main',
      }}
    />
  );
};

export default StatusChip;

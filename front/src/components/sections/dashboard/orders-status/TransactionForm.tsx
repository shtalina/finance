import { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Stack, SelectChangeEvent } from '@mui/material';
import Divider from '@mui/material/Divider';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

const TransactionForm = ({ onSubmit }: { onSubmit: (transaction: Transaction) => void }) => {
  const [formData, setFormData] = useState<Transaction>({ id: Date.now(), name: '', amount: 0, category: '', type: 'income' });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ id: Date.now(), name: '', amount: 0, category: '', type: 'income' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography align="center" variant="h3" fontWeight={600}>
        Create Transaction
      </Typography>
      <Divider sx={{ my: 3 }}>fill the form</Divider>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          variant="filled"
          placeholder='Name'
          autoComplete='transaction-name'
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="amount"
          name="amount"
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          variant="filled"
          placeholder='Amount'
          autoComplete='transaction-amount'
          fullWidth
          autoFocus
          required
        />
        <TextField
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" size="medium" fullWidth>
          Create
        </Button>
      </Stack>
    </form>
  );
};

export default TransactionForm;
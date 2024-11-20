import { fontFamily } from 'theme/typography';
import { useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DateSelect from 'components/dates/DateSelect';
import IconifyIcon from 'components/base/IconifyIcon';
import OrdersStatusTable from './OrdersStatusTable';
import TransactionForm from './TransactionForm';
import CategoryForm from './CategoryForm';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface Category {
  id: number;
  name: string;
}

const OrdersStatus = () => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleCreateTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const handleCreateCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    setEditingCategory(undefined);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  return (
    <Paper sx={{ px: 0 }}>
      <Stack
        px={3.5}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          flexGrow={1}
        >
          <Typography variant="h6" fontWeight={400} fontFamily={fontFamily.workSans}>
            Transactions
          </Typography>
          <TextField
            variant="filled"
            size="small"
            placeholder="Search for..."
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon={'mingcute:search-line'} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          spacing={1.5}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems={{ xs: 'flex-end', sm: 'center' }}
        >
          <DateSelect />
          <Button variant="contained" size="small" href='#'>
            Create order
          </Button>
        </Stack>
      </Stack>

      <Box mt={1.5} sx={{ height: 594, width: 1 }}>
        <OrdersStatusTable searchText={searchText} />
      </Box>
      
      <div>
        <TransactionForm onSubmit={handleCreateTransaction} />
        <ul>
          {transactions.map(transaction => (
            <li key={transaction.id}>
              {transaction.name} - {transaction.amount} - {transaction.category} - {transaction.type}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        />
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              {category.name}
              <button onClick={() => handleEditCategory(category)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>

    </Paper>
  );
};

export default OrdersStatus;

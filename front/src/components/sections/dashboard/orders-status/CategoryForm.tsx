import { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';

interface Category {
  id: number;
  name: string;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Category) => void;
}

const CategoryForm = ({ category, onSubmit }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Category>(category || { id: Date.now(), name: '' });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ id: Date.now(), name: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {category ? 'Edit Category' : 'Create Category'}
      </Typography>
      <Stack spacing={2}>
        <TextField
          name="name"
          label="Category Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {category ? 'Update' : 'Create'}
        </Button>
      </Stack>
    </form>
  );
};

export default CategoryForm;
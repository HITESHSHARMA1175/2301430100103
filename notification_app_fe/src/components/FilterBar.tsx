import { FormControl, InputLabel, Select, MenuItem, Box, SelectChangeEvent } from '@mui/material';

interface Props {
  selectedType: string;
  onChange: (type: string) => void;
}

export default function FilterBar({ selectedType, onChange }: Props) {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Filter By Type</InputLabel>
        <Select
          value={selectedType}
          label="Filter By Type"
          onChange={handleChange}
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

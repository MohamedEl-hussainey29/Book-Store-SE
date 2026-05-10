import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";

type SortOption =
  | "price-low"
  | "price-high"
  | "alpha-asc"
  | "alpha-desc"
  | "oldest"
  | "newest";

interface BooksToolbarProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void; // ✅ FIXED

  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;

  view: "grid" | "list";
  setView: (value: "grid" | "list") => void;

  total: number;
  startIndex: number;
}

export default function BooksToolbar({
  sortBy,
  setSortBy,
  itemsPerPage,
  setItemsPerPage,
  view,
  setView,
  total,
  startIndex,
}:BooksToolbarProps) {
    
  return (
    <Stack
  direction={{ xs: "column", sm: "row" }}
  justifyContent="space-between"
  alignItems={{ xs: "center", sm: "center" }}
  spacing={2}
  mb={3}
>
  <Typography
    variant="body2"
    color="#393280"
    fontWeight="bold"
    textAlign={{ xs: "center", sm: "left" }}
  >
    Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, total)} of {total} results
  </Typography>

  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    justifyContent={{ xs: "center", sm: "flex-end" }}
    flexWrap="wrap"
  >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel sx={{
                    color: '#393280',
                    '&.Mui-focused': {
                      color: '#ED553B',
                    }}}>Sort by</InputLabel>
                  <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)} 
                    sx={{
                      color: '#393280',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#393280', // Border color when idle
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ED553B', // Border color when active
                      }}}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="alpha-asc">Alphabetical: A-Z</MenuItem>
                    <MenuItem value="alpha-desc">Alphabetical: Z-A</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel sx={{
                    color: '#393280',
                    '&.Mui-focused': {
                      color: '#ED553B',
                    }}}>Show</InputLabel>
                  <Select value={itemsPerPage} label="Show" onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    sx={{
                      color: '#393280',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#393280', // Border color when idle
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ED553B', // Border color when active
                      }}}
                  >
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={24}>24</MenuItem>
                  </Select>
                </FormControl>

                <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small" 
                  sx={{
                    py:1,
                    '& .MuiToggleButton-root.Mui-selected': {
                      backgroundColor: '#FFF',
                      color: '#ED553B',
                    },
                    '& .MuiToggleButton-root': {
                      color: '#393280', 
                      borderColor: '#e0e0e0',
                    }
                  }}>
                  <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
                  <ToggleButton value="list"><ViewListIcon /></ToggleButton>
                </ToggleButtonGroup>
      
      </Stack>
    </Stack>
  );
}
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Filters {
  minPrice: string;
  maxPrice: string;
  types: string[];
  statuses: string[];
}

type FilterKey = "types" | "statuses";

interface BooksFilterProps {
  filters: Filters;
  setPrice: (field: "minPrice" | "maxPrice", value: string) => void;
  toggleFilter: (category: FilterKey, value: string) => void;
  applyFilters: () => void;
  categories: string[] | null;
}

export default function BooksFilter({
  filters,
  setPrice,
  toggleFilter,
  applyFilters,
  categories,
}: BooksFilterProps) {
  
  const sections = [
    {
      key: "types" as const,
      title: "Product Type",
      options: (categories ?? [])?.map((cat) => ({
        label: cat, 
        value: cat
      })),
    },
    {
      key: "statuses" as const,
      title: "Availability",
      options: [
        { label: "In Stock", value: "in stock" },
        { label: "Out of Stock", value: "out of stock" },
      ],
    },
  ];

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" color="#393280" fontWeight={700}>
              Price
            </Typography>
            <Box sx={{ width: "20px", height: "2px", backgroundColor: "#393280" }} />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              size="small"
              placeholder="Min"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setPrice("minPrice", e.target.value)}
            />
            <Typography color="text.secondary">to</Typography>
            <TextField
              size="small"
              placeholder="Max"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setPrice("maxPrice", e.target.value)}
            />
          </Stack>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#393280", borderRadius: 0, textTransform: 'none' }}
            onClick={applyFilters}
          >
            Filter
          </Button>
        </Box>
        <Box>
          {sections.map((section) => (
            <Accordion key={section.key} disableGutters sx={{ 
              mb: 2,
              border: '1px solid #E0E0E0', 
              borderRadius: '8px !important',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                boxShadow: '0px 6px 15px rgba(57, 50, 128, 0.1)'
              }
            }}>
              <AccordionSummary expandIcon={<AddIcon sx={{ color: "#393280" }} />}>
                <Typography variant="body1" fontWeight={700} color="#393280">
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack>
                  {section.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={filters[section.key].includes(option.value)}
                          onChange={() => toggleFilter(section.key, option.value)}
                          sx={{ '&.Mui-checked': { color: '#ED553B' } }}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
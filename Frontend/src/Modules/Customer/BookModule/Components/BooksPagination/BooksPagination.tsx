import { Stack, Pagination, PaginationItem } from "@mui/material";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BooksPaginationProps {
  page: number;
  setPage: (value: number) => void;
  pageCount: number;

}
export default function BooksPagination({
  page,
  setPage,
  pageCount,
}:BooksPaginationProps) {
  return (
    <Stack direction="row" justifyContent="center" mt={8}>
              <Pagination 
                count={pageCount}  
                page={page} 
                onChange={(_, value) => setPage(value)}
                shape='circular'
                variant="outlined"
                sx={{
                  '& .MuiPaginationItem-root': {mx:1,color:'#888'},
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#ED553B !important',
                    color: '#fff',
                    borderColor: '#ED553B',
                  },
                  '& .MuiPaginationItem-icon': {
                    color: '#ED553B',
                  }
                }}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    slots={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
                  />
                )}
              />
            </Stack>
  );
}
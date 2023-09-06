import { FC, ReactNode } from 'react';
import { Box, Grid, Paper, useTheme } from '@mui/material';

export const Banner: FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.primary.main, padding: 3, marginBottom: 5, width: '100%' }}>
      <Grid container direction="row" spacing={5} justifyContent="space-around">
        <Grid item xs={4}>
          <InfoCard>Text Placeholder</InfoCard>
        </Grid>
        <Grid item xs={4}>
          <InfoCard>Video Placeholder</InfoCard>
        </Grid>
      </Grid>
    </Box>
  );
};

const InfoCard: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Paper sx={{ minWidth: 250, minHeight: 250, padding: 1 }} elevation={3}>
      {children}
    </Paper>
  );
};

import React from 'react';
import { CircularProgress, Grid } from '@mui/material';

const Spinner: React.FC = () => (
  <Grid
    container
    spacing={0}
    direction='column'
    alignItems='center'
    justifyContent='center'
    style={{
      minHeight: 'calc(100 * var(--vh))',
      position: 'absolute',
      left: '0',
      top: '0',
      // zIndex: '5000',
    }}
  >
    <Grid item>
      <CircularProgress />
    </Grid>
  </Grid>
);

export default Spinner;

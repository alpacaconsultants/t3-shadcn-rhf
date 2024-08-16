import { makeStyles } from 'tss-react/mui';

export const useFieldMaterialUIStyles = makeStyles()(() => ({
  fullWidth: {
    width: '100%',
  },
  shortWidth: {
    maxWidth: '250px',
    width: '100%',
  },
}));

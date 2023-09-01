import { Dispatch, FC, SetStateAction } from 'react';
import { Lexicon } from '../../graphql/graphql';
import { FormControl, TextField, Autocomplete } from '@mui/material';

export interface DropDownProps {
  setValue: Dispatch<SetStateAction<Lexicon | null>>;
  options: Lexicon[];
};

export const DropDown: FC<DropDownProps> = ({ setValue, options }) => {
  return (
    <FormControl>
      <Autocomplete
        sx={{ width: 300 }}
        options={options}
        getOptionLabel={(lexicon) => lexicon.name}
        renderInput={(params) => <TextField {...params} label='Lexicon' />}
        onChange={(_event: any, newValue: Lexicon | null) => setValue(newValue)}
        isOptionEqualToValue={(option, value) => option._id == value._id}
      />
    </FormControl>
  );
};

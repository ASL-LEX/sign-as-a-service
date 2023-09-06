import { Dispatch, FC, SetStateAction } from 'react';
import { Lexicon } from '../../graphql/graphql';
import { FormControl, TextField, Autocomplete } from '@mui/material';

export interface DropDownProps {
  value: Lexicon | null;
  setValue: Dispatch<SetStateAction<Lexicon | null>>;
  options: Lexicon[];
  width: number;
}

const InputView: FC<{ params: any }> = ({ params }) => {
  if (params.inputProps) {
    if (params.inputProps.style) {
      params.inputProps.style.textAlign = 'center';
    } else {
      params.inputProps.style = { textAlign: 'center' };
    }
  } else {
    params.inputProps = { style: { textAlign: 'center' } };
  }

  return <TextField label="Lexicon" {...params} />;
};

export const DropDown: FC<DropDownProps> = ({ value, setValue, options, width }) => {
  return (
    <FormControl>
      <Autocomplete
        sx={{ width }}
        value={value}
        options={options}
        getOptionLabel={(lexicon) => lexicon.name}
        renderInput={(params) => <InputView params={params} />}
        onChange={(_event: any, newValue: Lexicon | null) => setValue(newValue)}
        isOptionEqualToValue={(option, value) => option._id == value._id}
      />
    </FormControl>
  );
};

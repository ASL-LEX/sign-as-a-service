import { GetAllLexEntriesQuery, useGetAllLexEntriesQuery } from '../graphql/lexicon/lexicon.ts';
import { DataGrid, GridColDef,DataGridProps } from '@mui/x-data-grid';
import { useState } from 'react';
import { Box, Stack, Button } from '@mui/material';
import { alpha, createTheme, styled } from '@mui/material/styles';



const tableColumns: GridColDef<GetAllLexEntriesQuery['lexiconAllEntries'][number]>[] = [
  {
    field: 'primary',
    headerName: 'Primary',
    width: 200,
    headerAlign: 'center',
  },
  {
    field: 'associates',
    headerName: 'Associates',
    width: 200,
    headerAlign: 'center',
  },
  {
    field: 'fields',
    headerName: 'Fields',
    width: 200,
    headerAlign: 'center',

  },
  {
    field: 'key',
    headerName: 'Key',
    width: 200,
    headerAlign: 'center',

  },
  {
    field: 'video',
    headerName: 'Video',
    width: 200,
    headerAlign: 'center',

  }
];


const LexiconTable = () => {
  //manage rows
  const [rows, setRows] = useState<GetAllLexEntriesQuery['lexiconAllEntries']>([]);

  //fetch data
  const { data } = useGetAllLexEntriesQuery({ variables: { lexicon: '64b15233e535bc69dc95b92f' } });
  const lexiconEntries = data?.lexiconAllEntries || []; 

  //inital state of number of rows -> temp = 3 
  const [nRows, setNRows] = useState(3);
  const removeRow = () => setNRows((x) => Math.max(0, x - 1));
 
  //needs to be be fixed and updated with actual data
  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      primary: 'new primary',
      associates: ['new associates'],
      fields: 'new fields',
      key: 'new key',
      video: 'new video',
    };

    setRows((prevRows) => [...prevRows, newRow]);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2}>
        <Button size="small" onClick={removeRow} disabled={nRows <= 0}>
          Remove Row
        </Button>
        <Button size="small" onClick={addRow}>
          Add Row
        </Button>
      </Stack>

      <div style={{display:'flex', flexDirection: 'column', width: '100%'}}>
      <DataGrid
        columns={tableColumns} 
        rows={lexiconEntries} 
        getRowId={({ key }) => key}    
      />
      </div>
    </Box>
  );
};

export default LexiconTable;



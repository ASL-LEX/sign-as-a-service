import { GetAllLexEntriesQuery, useGetAllLexEntriesQuery } from '../graphql/lexicon/lexicon.ts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

const tableColumns: GridColDef<GetAllLexEntriesQuery['lexiconAllEntries'][number]>[] = [
  {
    field: 'primary',
    headerName: 'Primary'
  },
  {
    field: 'associates',
    headerName: 'Associates'
  },
  {
    field: 'fields',
    headerName: 'Fields'
  },
  {
    field: 'key',
    headerName: 'Key'
  },
  {
    field: 'video',
    headerName: 'Video'
  }
];

const LexiconTable = () => {
  const { data } = useGetAllLexEntriesQuery({ variables: { lexicon: '64b15233e535bc69dc95b92f' } });
  const lexiconEntries = useMemo(() => data?.lexiconAllEntries || [], [data]);
  return <DataGrid columns={tableColumns} rows={lexiconEntries} getRowId={({ key }) => key} />;
};

export default LexiconTable;

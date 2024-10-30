import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridSlots
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { GetAllLexEntriesQuery, useGetAllLexEntriesQuery } from '../graphql/lexicon/lexicon.ts';
import { useEffect, useMemo } from 'react';
import { TextField } from '@mui/material';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      { id, primary: '', associates: '', fields: '', key: '', video: '', isNew: true },
      ...oldRows
    ]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'key' },
      ...oldModel
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

type LexiconEntriesStatus = GetAllLexEntriesQuery['lexiconAllEntries'][number] & {
  isNew: boolean;
  id: string;
};

export default function FullFeaturedCrudGrid() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const { data } = useGetAllLexEntriesQuery({ variables: { lexicon: '64b15233e535bc69dc95b92f' } });
  const lexiconEntries = useMemo(
    (): LexiconEntriesStatus[] =>
      data?.lexiconAllEntries.slice(0, 10).map((entry) => ({ ...entry, id: entry.key, isNew: false })) || [],
    [data]
  );

  //currently, rows are empty
  const [rows, setRows] = React.useState<LexiconEntriesStatus[]>(lexiconEntries);

  useEffect(() => {
    setRows(lexiconEntries);
  }, [lexiconEntries]);

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.key === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.key !== id));
    }
  };

  const processRowUpdate = (newRow: LexiconEntriesStatus) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.key === newRow.key ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<LexiconEntriesStatus>[] = [
    {
      field: 'primary',
      headerName: 'Primary',
      width: 200,
      headerAlign: 'center',
      editable: true
    },
    {
      field: 'associates',
      headerName: 'Associates',
      width: 200,
      headerAlign: 'center',
      editable: true
    },
    {
      field: 'fields',
      headerName: 'Fields',
      width: 200,
      headerAlign: 'center',
      editable: true,
      renderCell: ({ row }) => JSON.stringify(row.fields),
      renderEditCell: (params) => (
        <TextField
          value={JSON.stringify(params.row.fields)}
          onChange={(e) => {
            const updatedValue = JSON.parse(e.target.value);
            params.api.setEditCellValue({ id: params.id, field: params.field, value: updatedValue });
          }}
          variant="standard"
        />
      )
    },
    {
      field: 'key',
      headerName: 'Key',
      width: 200,
      headerAlign: 'center',
      editable: true
    },
    {
      field: 'video',
      headerName: 'Video',
      width: 200,
      headerAlign: 'center',
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />
        ];
      }
    }
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar']
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel }
        }}
      />
    </Box>
  );
}

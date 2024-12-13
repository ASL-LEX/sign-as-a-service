import { useCallback, useEffect, useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridSlots,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import {
  GetAllLexEntriesQuery,
  useGetAllLexEntriesQuery,
  useLexCreateEntryMutation,
  useLexDeleteEntryMutation,
  useLexUpdateEntryMutation
} from '../graphql/lexicon/lexicon.ts';
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';

interface DeleteModalInfo {
  open: boolean;
  rowId: GridRowId;
  entryKey: string | null;
}

const MultiInput = ({ defaultValue, onChange }: { defaultValue: string[]; onChange: (s: string[]) => void }) => {
  const [chips, setChips] = useState<string[]>(defaultValue);
  const [value, setValue] = useState('');

  useEffect(() => {
    onChange(chips);
  }, [chips]);

  const handleSubmit = () => {
    if (value.trim()) {
      setChips([...chips, value]);
      setValue('');
    }
  };

  const handleDelete = (chip: string) => {
    setChips(chips.filter((c) => c !== chip));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: 'fit' }}>
      <Box mt={2} display="flex" gap={1} flexWrap="wrap">
        {chips.map((chip, index) => (
          <Chip
            sx={{
              height: 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal'
              }
            }}
            key={index}
            label={chip}
            onDelete={() => handleDelete(chip)}
          />
        ))}
      </Box>
      <TextField
        variant="outlined"
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Associates"
        data-testid="lex-table-associates-edit"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSubmit} aria-label="submit">
                <CheckIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} data-testid="lex-table-delete-modal-delete-button">
          Delete
        </Button>
        <Button onClick={onClose} autoFocus data-testid="lex-table-delete-modal-cancel-button">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type LexiconTableRow = GetAllLexEntriesQuery['lexiconAllEntries'][number] & {
  isNew: boolean;
  id: number;
};

const LexiconTable = ({ lexiconId, loading: fetching }: { lexiconId: string | undefined; loading: boolean }) => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [deleteModalInfo, setDeleteModalInfo] = useState<DeleteModalInfo>({
    open: false,
    rowId: '',
    entryKey: null
  });
  const closeDeleteModal = () => setDeleteModalInfo({ open: false, rowId: '', entryKey: null });
  const { data, loading } = useGetAllLexEntriesQuery({
    variables: { lexicon: lexiconId || '' },
    skip: !lexiconId
  });
  const [createLexEntry] = useLexCreateEntryMutation();
  const [updateLexEntry] = useLexUpdateEntryMutation();
  const [deleteLexEntry] = useLexDeleteEntryMutation();

  const lexiconEntries = useMemo(
    (): LexiconTableRow[] => data?.lexiconAllEntries.map((entry, i) => ({ ...entry, id: i, isNew: false })) || [],
    [data]
  );
  const [rows, setRows] = useState<LexiconTableRow[]>(lexiconEntries);

  const { enqueueSnackbar } = useSnackbar();
  const showErrorSnackbar = useCallback(
    (message: string) => enqueueSnackbar(message, { variant: 'error', autoHideDuration: 3000, preventDuplicate: true }),
    [enqueueSnackbar]
  );

  useEffect(() => {
    setRows(lexiconEntries);
  }, [lexiconEntries]);

  const TableToolbar = () => {
    const handleAddRowClick = () => {
      setRows([
        { id: rows.length, primary: '', associates: [], fields: { english: '' }, key: '', video: '', isNew: true },
        ...rows
      ]);
      setRowModesModel((oldModel) => ({
        [rows.length]: { mode: GridRowModes.Edit, fieldToFocus: 'key' },
        ...oldModel
      }));
    };

    return (
      <GridToolbarContainer
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRowClick}>
          Add record
        </Button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  };

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

  const handleDelete = async (id: GridRowId, key: string | null) => {
    if (!key || !lexiconId) return;
    const deleted = await deleteLexEntry({ variables: { lexicon: lexiconId, key } });
    if (deleted.data?.lexiconDeleteEntry) {
      setRows(rows.filter((row) => row.id !== id));
    }
    return;
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowEdit = async (newRow: LexiconTableRow, oldRow: LexiconTableRow) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename: _, id, isNew, ...lexEntry } = newRow;
    const { data, errors } = await updateLexEntry({
      variables: { lexEntry: { ...lexEntry, lexicon: lexiconId || '', findByKey: oldRow.key } }
    });

    if (!data) {
      errors?.map(({ message }) => showErrorSnackbar(message));
      throw new Error(); // Rejecting the promise keeps the row in edit mode
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename, ...newEntry } = data.lexiconUpdateEntry;
    const updatedRow = { ...newEntry, isNew: false, id };
    setRows(rows.map((row) => (row.id === id ? updatedRow : row)));
    return updatedRow;
  };

  const processRowAdd = async (newRow: LexiconTableRow) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename: _, isNew, id, ...lexEntry } = newRow;
    const { data, errors } = await createLexEntry({
      variables: { lexEntry: { ...lexEntry, lexicon: lexiconId || '' } }
    });

    if (!data) {
      errors?.map(({ message }) => showErrorSnackbar(message));
      throw new Error(); // Rejecting the promise keeps the row in edit mode
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename, ...newEntry } = data.lexiconAddEntry;
    const updatedRow = { ...newEntry, isNew: false, id };
    setRows(rows.map((row) => (row.id === id ? updatedRow : row)));
    return updatedRow;
  };

  const processRowUpdate = async (newRow: LexiconTableRow, oldRow: LexiconTableRow) => {
    if (newRow.isNew) return processRowAdd(newRow);
    return processRowEdit(newRow, oldRow);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<LexiconTableRow>[] = [
    {
      field: 'primary',
      headerName: 'Primary',
      flex: 2,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      editable: true
    },
    {
      field: 'associates',
      headerName: 'Associates',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      editable: true,
      renderCell: ({ row }) => (
        <Box>
          {row.associates.map((a) => (
            <Chip
              sx={{
                height: 'auto',
                padding: '4px',
                margin: '2px',
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal'
                }
              }}
              label={a}
              key={`${row.primary}-${a}`}
            />
          ))}
        </Box>
      ),
      renderEditCell: (params) => {
        return (
          <MultiInput
            defaultValue={params.row.associates}
            onChange={(value) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value });
            }}
          />
        );
      }
    },
    {
      field: 'fields',
      headerName: 'Fields',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
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
          data-testid="lex-table-fields-edit"
        />
      )
    },
    {
      field: 'key',
      headerName: 'Key',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      editable: true
    },
    {
      field: 'video',
      headerName: 'Video',
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      editable: true,
      renderCell: ({ row }) => (
        <iframe
          data-testid="lex-table-video-cell"
          style={{ height: '125px', aspectRatio: '1.25' }}
          src={`${row.video}`}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      sortable: false,
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              data-testid="lex-table-save-button"
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              data-testid="lex-table-cancel-button"
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
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => setDeleteModalInfo({ open: true, rowId: id, entryKey: row.key })}
            color="inherit"
          />
        ];
      }
    }
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        data-testid="lex-table"
        columns={columns}
        getRowHeight={() => 'auto'}
        onProcessRowUpdateError={() => {}}
        pageSizeOptions={[10, 15, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: TableToolbar as GridSlots['toolbar']
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          },
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton'
          }
        }}
        autoHeight
        loading={loading || fetching}
        disableColumnResize
        sx={{ width: '100%' }}
      />
      <ConfirmDeleteModal
        open={deleteModalInfo.open}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModalInfo.rowId, deleteModalInfo.entryKey).then(() => closeDeleteModal())}
      />
    </>
  );
};

export default LexiconTable;

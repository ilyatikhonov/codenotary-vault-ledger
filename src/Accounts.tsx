import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener, GridOverlay,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridToolbarContainer
} from "@mui/x-data-grid";
import {AccountServiceClient} from "./proto/accountservice_pb_service";
import {Button, Snackbar, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import {useCallback, useEffect} from "react";
import Alert, {AlertProps} from "@mui/material/Alert";
import {Account, ListAccountsRequest} from "./proto/accountservice_pb";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const client = new AccountServiceClient( process.env.REACT_APP_API_HOST ?? "");

interface Props {
    setSelectedAccount: (accountNumber: string | null) => void
}


export function AccountTable(props: Props) {
    const initialRows: GridRowsProp = [];
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [rows, setRows] = React.useState(initialRows);
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
    });

    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    const [rowCountState, setRowCount] = React.useState(0);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        if (id == "new") {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const createAccount = useCallback((accNew: Account.AsObject) => {
        return new Promise<Account.AsObject>((resolve, reject) => {
            const accSave = new Account();
            accSave.setNumber(accNew.number);
            accSave.setName(accNew.name);
            accSave.setIban(accNew.iban);
            accSave.setAddress(accNew.address);
            client.createAccount(accSave, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    accSave.setId(response!.getId());
                    resolve(accSave.toObject());
                }
            })
        })
    }, []);

    const processRowUpdate = async (row: GridRowModel) => {
        const newRow = await createAccount(row as Account.AsObject);
        setSnackbar({children: 'New account saved', severity: 'success'});
        setRowCount(rowCountState + 1);
        let newRows = rows.filter((row) => row.id !== 'new')
        if (newRows.length >= paginationModel.pageSize) {
            newRows.shift()
        }
        setRows(newRows.concat(newRow));
        return row;
    };

    const handleProcessRowUpdateError = useCallback((error: Error) => {
        setSnackbar({children: error.message, severity: 'error'});
    }, []);

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {field: 'number', headerName: 'Acc Number', flex: 150, editable: true},
        {field: 'name', headerName: 'Acc Name', flex: 150, editable: true},
        {field: 'iban', headerName: 'IBAN', flex: 150, editable: true},
        {field: 'address', headerName: 'Address', flex: 150, editable: true},
        {
            field: 'actions',
            type: 'actions',
            flex: 100,
            cellClassName: 'actions',
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{color: 'primary.main'}}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                } else {
                    return [
                        <GridActionsCellItem
                            icon={<MenuOpenIcon sx={{ fontSize: 40 }}/>}

                            label="Show Transactions"
                            onClick={() =>
                                props.setSelectedAccount(rows.find((row) => row.id === id)!.number)
                            }
                            color="inherit"
                        />,
                    ];
                }

                return [];
            },
        }
    ];


    useEffect(() => {
        const request = new ListAccountsRequest();
        request.setPageNumber(paginationModel.page + 1)
        request.setPageSize(paginationModel.pageSize)

        client.listAccounts(request, (err, response) => {
            if (err || response === null) {
                return console.error(err)
            }

            setRows(response.getAccountsList().map((a) => a.toObject()))
            setRowCount(response.getTotalCount())
        })
    }, [paginationModel]);


    return (
        <Box sx={{width: '100%'}}>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                rowCount={rowCountState}
                // loading={isLoading}
                editMode="row"
                isCellEditable={(params) => params.row.id == "new"}
                pageSizeOptions={[10, 50, 100]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                hideFooterSelectedRowCount={true}
                slots={{
                    toolbar: EditToolbar,
                    noRowsOverlay: () => (
                        <GridOverlay>
                            <Typography align="center">No accounts yet. Add one now</Typography>
                        </GridOverlay>
                    )
                }}
                slotProps={{
                    toolbar: {setRows, setRowModesModel},
                }}
            />
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar}/>
                </Snackbar>
            )}
        </Box>
    )
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const {setRows, setRowModesModel} = props;

    const handleClick = () => {
        const id = 'new';
        setRows((oldRows) => {
            if (oldRows.find((row) => row.id === id) != null) {
                // already in edit mode. Break
                return oldRows;
            }
            return [...oldRows, {id, name: '', number: '', iban: '', address: ''}]
        });
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: 'number'},
        }));
    };

    return (
        <GridToolbarContainer style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
                Add record
            </Button>
            <Typography variant="h5">Accounts</Typography>
            <Typography style={{width: "100px"}} variant="h5"></Typography>
        </GridToolbarContainer>
    );
}
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
import {
    Account,
    ListAccountsRequest,
    ListTransactionsRequest,
    Transaction,
    TransactionTypeMap
} from "./proto/accountservice_pb";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const client = new AccountServiceClient(process.env.REACT_APP_API_HOST ?? "");

interface Props {
    accountNumber: string
    setSelectedAccount: (accountNumber: string | null) => void
}
export function TransactionTable(props: Props) {
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


    const createTransaction = useCallback((trNew: Transaction.AsObject) => {
        return new Promise<Transaction.AsObject>((resolve, reject) => {
            const trSave = new Transaction();
            trSave.setAmount(trNew.amount);
            
            trSave.setType(trNew.type);
            trSave.setAccountNumber(props.accountNumber);

            client.createTransaction(trSave, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    trSave.setId(response!.getId());
                    resolve(trSave.toObject());
                }
            })
        })
    }, []);

    const processRowUpdate = async (row: GridRowModel) => {
        const newRow = await createTransaction(row as Transaction.AsObject);
        setSnackbar({children: 'New transaction saved', severity: 'success'});
        setRowCount(rowCountState + 1);
        let newRows = rows.filter((row) => row.id !== 'new')
        if (newRows.length >= paginationModel.pageSize) {
            newRows.shift()
        }
        setRows(newRows.concat(newRow));
        return row;
    };

    const handleProcessRowUpdateError = useCallback((error: Error) => {
        // throw error;
        setSnackbar({children: error.message, severity: 'error'});
    }, []);

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Type',
            type: 'singleSelect',
            valueOptions: [
                { value: 0, label: 'DEPOSIT' },
                { value: 1, label: 'WITHDRAWAL' }
            ],
            width: 180,
            editable: true
        },
        {
            field: 'amount',
            headerName:'Amount',
            type: 'number',
            width: 150,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
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
                }

                return [];
            },
        }
    ];


    useEffect(() => {
        const request = new ListTransactionsRequest();
        request.setAccountNumber(props.accountNumber)
        request.setPageNumber(paginationModel.page + 1)
        request.setPageSize(paginationModel.pageSize)

        client.listTransactions(request, (err, response) => {
            if (err || response === null) {
                return console.error(err)
            }

            setRows(response.getTransactionsList().map((a) => a.toObject()))
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
                            <Typography align="center">No Transactions yet. Add one now</Typography>
                        </GridOverlay>
                    )

                }}
                slotProps={{
                    toolbar: {setRows: setRows, setRowModesModel, setSelectedAccount: props.setSelectedAccount, accountNumber: props.accountNumber},
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
    setSelectedAccount: (accountNumber: string | null) => void;
    accountNumber: string;
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
            return [...oldRows, {id, type: 0, amount: 0}]
        } );
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: 'type'},
        }));
    };

    return (
        <GridToolbarContainer style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Button color="primary" startIcon={<ArrowBackIcon/>} onClick={() => props.setSelectedAccount(null)}>
                    Back to accounts
                </Button>
                <Typography variant="h5">Transactions of {props.accountNumber}</Typography>
                <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
                    Add TRANSACTION
                </Button>

        </GridToolbarContainer>
    );
}
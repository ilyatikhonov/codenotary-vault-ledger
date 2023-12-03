import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import {AccountTable} from "./Accounts";
import {TransactionTable} from "./Transactions";



export default function App() {
    const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);

    return (
        <Container maxWidth="lg">
            <Box sx={{my: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Accounting App
                </Typography>
                {
                    selectedAccount == null ?
                        <AccountTable setSelectedAccount={setSelectedAccount}/> :
                        <TransactionTable accountNumber={selectedAccount} setSelectedAccount={setSelectedAccount}/>
                }

            </Box>
        </Container>
    );
}



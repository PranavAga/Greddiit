import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline } from "@mui/material";


export default function Subgreddiits(){
    const theme=Theme;

    return(
        <main>
            <ThemeProvider theme={theme}>
                <CssBaseline>
            {/* Search Bar */}
                <Box 
                sx={{
                    border: 2,
                    borderColor: 'secondary.main',
                    borderStyle:'dotted',
                    borderRadius: 3,
                    display:'flex',
                flexDirection: 'column',
                alignItems:"center",
                justifyContent:"center"}}
                >
                    <h2>Search Bar</h2>
                </Box>

            {/* Joined Subgrediits */}
                <Box 
                    sx={{
                        border: 2,
                        borderColor: 'secondary.main',
                        borderStyle:'dotted',
                        borderRadius: 3,
                        p: 2
                        }}
                    >
                        <h2>Joined Subgreddiits</h2>
                    </Box>

            {/* Other Subgrediits */}
                </CssBaseline>
            </ThemeProvider>


        </main>
    )
}
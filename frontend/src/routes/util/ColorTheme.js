import { createTheme } from '@mui/material/styles';
// import { light } from '@mui/material/styles/createPalette';

export const Theme=createTheme({
    palette:{
        background:{
            default: '#f4f5e6'
        },
        primary:{
            white: '#fcfcfc',
            dark: '#d63504',
            main: '#fa4c16',
            light: '#fce5de',
            black: '#050505'
        },
        secondary:{
            dark: '#a2a82a',
            main: '#d1d841',
            light: '#f4f5e6'
        },
        upVote:{
            main:'#a2a82a'
        },
        downVote:{
            main:'#d63504'
        }
        
        
        
    },
    typography:{
        fontFamily:"sans-serif",
        button:{
            textTransform:'none'
        }
    }
});

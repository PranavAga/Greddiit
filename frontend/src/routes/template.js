import { Fragment } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Top from './util/top';
import {Theme} from './util/ColorTheme.js';

export default function JoinedSG(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;

    return(
        <Fragment>
            <Top/>
            <ThemeProvider theme={theme}><CssBaseline>

            </CssBaseline>
            </ThemeProvider>
            
        </Fragment>
    )
}
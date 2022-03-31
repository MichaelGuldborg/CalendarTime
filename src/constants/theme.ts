// @ts-ignore
import {createTheme} from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#0A72EF",
            contrastText: '#ffffff',
        },
        secondary: {
            main: "#20CC74",
            contrastText: '#ffffff'
        },
        error: {
            light: "#EA8080",
            main: "#E35555",
            dark: "#DC2B2B",
        },
        warning: {
            light: "#FFDFA0",
            main: "#FFCF71",
            dark: "#FFBF42",
        },
        info: {
            light: "#EFEFF1",
            main: "#D4D4D9",
            dark: "#B9B9C1",
        },
        success: {
            light: "#CCF4EC",
            main: "#66DFC7",
            dark: "#00C9A1",
        },
        text: {
            primary: "#282828",
        }
    },
    typography: {
        fontSize: 13,
    },
    // overrides: {
    //     MuiPaper: {
    //         root: {
    //             overflow: 'hidden',
    //             boxShadow: '0 1px 4px rgba(0,0,0,.09)'
    //         },
    //         elevation0: {
    //             boxShadow: '0 1px 4px rgba(0,0,0,.09)'
    //         },
    //         elevation1: {
    //             boxShadow: '0 1px 4px rgba(0,0,0,.09)'
    //         },
    //         elevation2: {
    //             boxShadow: '0 1px 4px rgba(0,0,0,.09)'
    //         },
    //         elevation3: {
    //             boxShadow: '0 1px 4px rgba(0,0,0,.09)'
    //         },
    //         elevation4: {
    //             boxShadow: '0 1px 4px rgba(0,0,0,.09)'
    //         },
    //         elevation8: {
    //             boxShadow: '0 4px 8px rgba(0,0,0,.2)'
    //         }
    //
    //     },
    //     MuiFilledInput: {
    //         root: {
    //             backgroundColor: "#FAFAFA",
    //             borderRadius: 0,
    //             borderTopLeftRadius: 0,
    //             borderTopRightRadius: 0,
    //         },
    //     },
    //     MuiTooltip: {
    //         tooltip: {
    //             fontSize: 14,
    //             padding: '8px 16px',
    //             transition: 'opacity 0.5s cubic-bezier(0.12, 1.04, 0.77, 1.01)',
    //         },
    //     },
    //     MuiListItem: {
    //         root: {
    //             background: 'white',
    //             padding: 8
    //         }
    //     },
    //     MuiTableCell: {
    //         head: {
    //             fontWeight: 'bold',
    //         },
    //     },
    // },
});

export default theme;
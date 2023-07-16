import React, { useState, useEffect } from "react";
import { Container, CssBaseline, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import fetchUserInfo from "../utils/fetchUserInfo";
import NavigationBar from "../components/navigation/NavigationBar";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardPanel from "../components/dashboard/DashboardPanel";
import RandomQuotePanel, { Quote } from "../components/dashboard/RandomQuotePanel";
import MiniTimerPanel from "../components/dashboard/MiniTimerPanel";
import SelectTemplateDialog from "../components/timer/dialogs/SelectTemplateDialog";

/**
 * A Grid item that wraps a DashboardPanel.
 */
function DashboardPanelGridItem({ children } : { children : React.ReactElement }) {
    return (
        <Grid item xs={12} sm={6} padding={{ xs: 1.5, sm: 2, md: 2.5 }}>
            { children }
        </Grid>
    );
}

/**
 * Represents the page accessed by URL / in React Router when logged in. Contains the
 * dashboard feature to be developed in // TODO: Study.
 * 
 * @returns A React component object representing the dashboard page.
 */
export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ loading, setLoading ] = useState(true);
    const [ quote, setQuote ] = useState({ content: "Loading...", author: "" });
    const navigate = useNavigate();

    async function fetchRandomQuote( callback : ( quote : Quote ) => void ) {
      // get random quote from Quotable (https://github.com/lukePeavey/quotable)
      const response = await fetch("https://api.quotable.io/quotes/random");
      const quote = await response.json();
      callback( {
        content: quote[0].content, 
        author: quote[0].author
      } );
    }
  
    useEffect(() => {
      fetchRandomQuote(setQuote);
    }, []);

    function Temp() {
        return (
            
            <>
            <Stack sx={{ height: "calc(100vh - 120px)", padding: "2em" }} display="flex" direction="column" gap={3} justifyContent="center" marginTop={5} alignItems="center">
                <Typography variant="h3" component="h1" marginTop={5}>
                { userData.user_name === null ? "" : `Welcome back ${userData.user_name}!`}
                </Typography>
                <Typography maxWidth="800px" component="p" fontSize="1.5em">
                    This dashboard is under construction! 🚧👷<br />
                </Typography>
                <Typography maxWidth="800px" component="p" fontSize="1.5em">
                    Click/Tap on the hamburger icon (<MenuIcon fontSize="small" />) on the top-left corner to access the wonderful mini-applications and features we have curated so far!
                </Typography>
                </Stack>
            </>
        )
    }

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [loading, navigate]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <> 
                <CssBaseline />
                <NavigationBar title="Dashboard" />
                <Container maxWidth="md">
                    <Stack gap={3} marginTop={5}>
                        <Typography variant="h3" component="h1" textAlign="center">
                            { userData.user_name === null ? "" : `Welcome back ${userData.user_name}!`}
                        </Typography>
                        <Grid container padding={2}>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Tasks" href="/tasks">
                                    <Typography>Hello world!</Typography>
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Timer" href="/timer">
                                    <MiniTimerPanel />
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Notes" href="/notes">
                                    <Typography>Hello world!</Typography>
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Telegram Bot" href="">
                                    <Typography>Hello world!</Typography>
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Canvas Downloader" href="">
                                    <Typography>Hello world!</Typography>
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Random Quote of the Day" href="" onClick={ () => { fetchRandomQuote(setQuote) } } buttonTitle="Refresh Quote">
                                    <RandomQuotePanel quote={ quote } />
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                        </Grid>
                    </Stack>
                </Container>
            </>
            
        );
}


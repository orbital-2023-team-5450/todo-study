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
import CanvasDownloaderPanel from "../components/dashboard/CanvasDownloaderPanel";
import { Telegram } from "@mui/icons-material";
import NotesPanel from "../components/dashboard/NotesPanel";
import TelegramBotPanel from "../components/dashboard/TelegramBotPanel";
import TasksPanel from "../components/dashboard/TasksPanel";
import DashboardNoteSortDialog, { DashboardNoteSettings } from "../components/dashboard/note-taking/DashboardNoteSortDialog";
import DashboardTaskSettingsDialog, { DashboardTaskSettings } from "../components/dashboard/tasks/DashboardTaskSettingDialog";

/**
 * A Grid item that wraps a DashboardPanel.
 */
function DashboardPanelGridItem({ children } : { children : React.ReactNode }) {
    return (
        <Grid item xs={12} sm={6} pl={1.5} pr={1.5}>
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
    
    const [ taskSortSettings, setTaskSortSettings ] = useState<DashboardTaskSettings>({ taskCount: 3, sort: 'dsee' });
    const [ taskSortDialogOpen, setTaskSortDialogOpen ] = useState(false);
    const [ noteSortSettings, setNoteSortSettings ] = useState<DashboardNoteSettings>({ noteCount: 3, sort: 'mrm' });
    const [ noteSortDialogOpen, setNoteSortDialogOpen ] = useState(false);
    const [ timerDialogOpen, setTimerDialogOpen ] = useState(false);
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
                        <Typography pl={3} pr={3} pt={1} variant="body2" fontSize="1.1em" component="h2" textAlign="center">
                            You can click/tap on the links in the dashboard or the hamburger icon (<MenuIcon fontSize="small" />) on the top-left corner to access the wonderful mini-applications and features we have curated so far!
                        </Typography>
                        <Grid container padding={2}>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Tasks" href="/tasks" onSettingsClick={ () => { setTaskSortDialogOpen(true) } } tooltip="Sort tasks by...">
                                    <TasksPanel settings={ taskSortSettings } />
                                    <DashboardTaskSettingsDialog open={ taskSortDialogOpen } handleClose={ () => { setTaskSortDialogOpen(false) } } value={ taskSortSettings } onChange={ setTaskSortSettings } />
                                </DashboardPanel>
                                <DashboardPanel title="Timer" href="/timer" onSettingsClick={ () => { setTimerDialogOpen(true) } } tooltip="Change timer template">
                                    <MiniTimerPanel open={ timerDialogOpen } onOpen={ () => { setTimerDialogOpen(false) } } />
                                </DashboardPanel>
                                <DashboardPanel title="Canvas Downloader" href="">
                                    <CanvasDownloaderPanel />
                                </DashboardPanel>
                            </DashboardPanelGridItem>
                            <DashboardPanelGridItem>
                                <DashboardPanel title="Notes" href="/notes" onSettingsClick={ () => { setNoteSortDialogOpen(true) } } tooltip="Sort notes by...">
                                    <NotesPanel settings={ noteSortSettings } />
                                    <DashboardNoteSortDialog open={ noteSortDialogOpen } handleClose={ () => { setNoteSortDialogOpen(false) } } value={ noteSortSettings } onChange={ setNoteSortSettings } />  
                                </DashboardPanel>
                                <DashboardPanel title="Telegram Bot" href="">
                                    <TelegramBotPanel />
                                </DashboardPanel>
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


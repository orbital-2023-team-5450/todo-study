import React, { useEffect, useState } from 'react';
import { Button, Container, CssBaseline, Divider, Stack, Typography } from '@mui/material';
import NavigationBar from '../components/navigation/NavigationBar';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import CanvasDownloaderButton from '../components/canvas-downloader/CanvasDownloaderButton';
import CanvasTokenForm from '../components/canvas-downloader/CanvasTokenForm';
import { createTextEventHandler } from '../utils/textInputUtils';

type Course = {
  id : number,
  name : string,
}

type CanvasFile = {
  id : number,
  "content-type" : string,
  url : string,
  "display_name" : string,
  "folder_id" : number,
}

type CanvasFolder = {
  id : number,
  "files_url" : string,
  "full_name" : string,
  "parent_folder_id" : number,
}

type CanvasFolderWithFiles = {
  id : number,
  "files_url" : string,
  "full_name" : string,
  "parent_folder_id" : number,
  files: CanvasFile[]
}

export default function CanvasDownloader() {

  const [ data, setData ] = useState<{ course : Course, folders : CanvasFolderWithFiles[] }[]>([]);
  const [ refresh, setRefresh ] = useState(false);
  const [ downloadStatus, setDownloadStatus ] = useState(false);
  const [ token, setToken ] = useState("");
  const [ canvasDownloaderShow, setCanvasDownloaderShow ] = useState(false);

  const getURL = ( apiPath : string ) => 'https://fathomless-badlands-26109-fa982fa331e2.herokuapp.com/https://canvas.nus.edu.sg/api/v1/' + apiPath +'?per_page=1000&access_token=' + token;

  function fetchCanvasAPI(apiPath : string, fullPath : boolean = false) {
    const pathToUse = (fullPath) ? apiPath : getURL(apiPath);
    console.log(pathToUse);
    return fetch(pathToUse, {
      method: 'GET',  
      headers: {
        'Accept': 'application/json',
      }
    });
  }

  async function fetchCourses() {
    try {
      const response = await fetchCanvasAPI('courses');
      const text = await response.json();
      return (text as Course[]).filter(course => course.name !== undefined);
    } catch (error) {
      alert("Failed to fetch! " + error);
      return [] as Course[];
    }
  }

  async function getCourseFolders( courseId : number ) {
    try {
      const response = await fetchCanvasAPI('courses/' + courseId.toString() + '/folders');
      const text = await response.json();
      return (text as CanvasFolder[]);
    } catch (error) {
      alert("Failed to fetch! " + error);
      return [] as CanvasFolder[];
    }
  }

  function handleGetFilesClick() {
    fetchCourses()
      .then(courses => courses.map((course) => {
        const foldersArray : CanvasFolderWithFiles[] = [];
        getCourseFolders(course.id)
          .then(async (folders) => {
            for (let i = 0; i < folders.length; i++) {
              const files = await getFilesFromFolder(folders[i].id);
              foldersArray.push({ ...folders[i], files: files });
            }
          });
        return { course: course, folders: foldersArray };
      })).then((ar) => { 
        console.log(ar);
        setData(ar);
      })
  }

  function getPathFromFolderId(folderId : number, folders : CanvasFolder[]) {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id && folders[i].id === folderId) {
        return folders[i].full_name;
      }
    }
    return "???";
  }

  function getPaths(files : CanvasFile[], folders : CanvasFolder[]) {
    // for every file, get its folder ID
    return files.map(file => getPathFromFolderId(file.folder_id, folders) + "/" + file.display_name);
  }

  async function getFilesFromFolder(folderId : number) {
    try {
      const response = await fetchCanvasAPI('folders/' + folderId.toString() + '/files');
      const text = await response.json();
      return text as CanvasFile[];
    } catch (error) {
      alert("Failed to fetch! " + error);
      return [] as CanvasFile[];
    }
  }

  async function downloadFile(url : string | URL) {
    const response = await fetch(url);
    return await response.blob();
  }

  const handleDownload = async () => {
    setDownloadStatus(true);
    const zip = new JSZip();
    for (let i = 0; i < data.length; i++) {
      const { course, folders } = data[i];
      const courseZip = zip.folder(course.name);
      for (let j = 0; j < folders.length; j++) {
        if (courseZip === null) {
          alert("Cannot process download!");
          return;
        }
        const folderZip = courseZip.folder(folders[j].full_name);
        const fileList = folders[j].files;
        for (let k = 0; k < fileList.length; k++) {
          if (folderZip === null) {
            alert("Cannot process download!");
            return;
          }
          const file = fileList[k];
          const content = await downloadFile(file.url)
          folderZip.file(file.display_name, content, {binary : true})
        }
      }
    }
    zip.generateAsync({ type: 'blob' }).then((content : any) => {
      FileSaver.saveAs(content, 'download.zip');
    });
    setDownloadStatus(false);
  }

  const handleTokenChange = createTextEventHandler(setToken);

  const handleAccessTokenDone = () => {
    if (token !== "") {
      setCanvasDownloaderShow(true);
    }
  }

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <> 
      <CssBaseline />
      <NavigationBar title="Canvas Downloader" />

      <Container maxWidth="md" sx={{ textAlign: 'center'}}>
        
      { !canvasDownloaderShow ? (
        <CanvasTokenForm handleAccessTokenDone={ handleAccessTokenDone } token={token} onChange={handleTokenChange} />
      ) : (
        <Stack gap={5} mt={5}>
          <Typography variant="h4" component="h1">Canvas Downloader</Typography>
          <Stack gap={1} textAlign="left">
            <Typography><strong>Step 1: </strong>Retrieve the files from Canvas. Note that only the module title will show up when you click on this button.</Typography>
            <Typography><strong>Step 2: </strong>Refresh the files. Here, the files to download will be slowly populated below. It may need a while for all files to be fetched from the Canvas API. Wait a minute or two before refreshing to ensure all files are loaded.</Typography>
            <Typography><strong>Step 3: </strong>After <strong>ALL</strong> the files that you want have been displayed below, click/tap the <strong>Download files</strong> button to download the files as a ZIP. As this app is downloading many files, note that it will take a few minutes for the save dialog to pop up, so please be patient 😄</Typography>
          </Stack>
          <Stack direction="row" gap={3} justifyContent="center" alignItems="center">
            <CanvasDownloaderButton step={1} title="Get files to download" onClick={ handleGetFilesClick } />
            <KeyboardArrowRightIcon />
            <CanvasDownloaderButton step={2} title="Refresh files" onClick={ () => setRefresh(true) } />
            <KeyboardArrowRightIcon />
            <CanvasDownloaderButton step={3} title="Download files" onClick={ handleDownload } />
          </Stack>
          { downloadStatus ? (
            <Typography variant="h5">Downloading... Please wait a few minutes for the save dialog to load up.</Typography>
          ) : <></> }
          <Divider />
          <Typography variant="h4" component="h1">List of files to download</Typography>
            { (data.length !== 0) ?
              data.map(({ course, folders }) => {
              return (
                <Stack textAlign="left">
                  <Typography variant="h5" component="h2">{ course.name ?? "Unnamed course" }</Typography>
                  <ol>
                    { folders.map(folder => { return (
                      <li>
                        { folder.full_name }
                        <ol>
                          { folder.files.map(file => { return (
                            <li><Typography>{ file.display_name }</Typography></li>
                          )}) }  
                        </ol>  
                      </li>
                    )}) }
                  </ol>
                </Stack>
              )
            }) : (
              <Typography>
                No files loaded yet. Click/tap on the <strong>get files to download</strong> button and refresh to ensure all files are loaded.
              </Typography>
            ) }
        </Stack>
      ) }
      </Container>
    </>
  );
}
import { useEffect, useState } from "react";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { Alert, Button, List, ListItemButton, ListItemIcon, ListItemText, Snackbar, SnackbarCloseReason, Stack } from '@mui/material';
// import { BaseDirectory, readTextFile, readDir, DirEntry } from '@tauri-apps/plugin-fs';
// import Folder from '@mui/icons-material/FolderOutlined';
import File from '@mui/icons-material/InsertDriveFileOutlined';
// import UpArrow from '@mui/icons-material/NorthOutlined';
import { World } from './World';


export default function Page() {
  const [open, setOpen] = useState(false);
  const [worldPath, setWorldPath] = useState<string>("");
  const [keys, setKeys] = useState<string[]>([]);

  async function selectWorld() {
    const selected = await openDialog({
      multiple: false,
      directory: true,
    });
    setWorldPath(selected ?? '');
  }

  useEffect(() => {
    if (worldPath) {
      World.load(worldPath).then(world => {
        setKeys(world.keys);
        setOpen(true);
      })
    }
  }, [worldPath]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  
  return (
    <main className="container">
      <h1>Bedrock Viewer</h1>

      <Stack direction="column" spacing={2} justifyContent="left">
        <Button variant="contained" onClick={selectWorld} sx={{ maxWidth: '20em' }}>Select world</Button>
        <p>{worldPath}</p>

        <List dense>
          {keys.map((key, i) => (
            <ListItemButton key={i}>
              <ListItemIcon>
                <File />
              </ListItemIcon>
              <ListItemText>{key}</ListItemText>
            </ListItemButton>
          ))}
        </List>
        
      </Stack>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Successfully loaded world!
        </Alert>
      </Snackbar>
    </main>
  );
}

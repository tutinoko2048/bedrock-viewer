import { useEffect, useState } from "react";
import { path } from '@tauri-apps/api';
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { BaseDirectory, readTextFile, readDir, DirEntry } from '@tauri-apps/plugin-fs';
import Folder from '@mui/icons-material/FolderOutlined';
import File from '@mui/icons-material/InsertDriveFileOutlined';
import UpArrow from '@mui/icons-material/NorthOutlined';

export default function Page() {
  const sep = path.sep()
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const [worldPath, setWorldPath] = useState<string>("");
  const [dirEntries, setDirEntries] = useState<DirEntry[]>([]);
  const [content, setContent] = useState<string>("");

  async function selectWorld() {
    const selected = await open({
      multiple: false,
      directory: true,
    });
    setWorldPath(selected ?? '');
  }

  async function selectFile() {
    const selected = await open({
      multiple: false,
      directory: false,
    });
    if (selected) {
      setContent(`Loading ${selected}...`);
      const text = await readTextFile(selected, { baseDir: BaseDirectory.AppConfig });
      setContent(text);
    }
  }

  // async function readDir(path: string) {
  //   if (!path) setDirEntries([]);
  //   setDirEntries(await invoke("read_dir", { path }));
  // }

  useEffect(() => {
    readDir(worldPath).then(entries => (
      setDirEntries(entries)
    )).catch(console.error);
  }, [worldPath]);

  async function onEntryClick(entry: DirEntry) {
    if (entry.isDirectory) {
      setWorldPath(await path.join(worldPath, entry.name));
    } else {
      const text = await readTextFile(await path.join(worldPath, entry.name));
      setContent(text);
    }
  }
  
  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <Stack direction="column" spacing={2} justifyContent="left">
        <Button variant="contained" onClick={selectWorld} sx={{ maxWidth: '20em' }}>Select world</Button>
        <p>{worldPath}</p>

    <Box>

        <IconButton onClick={() => worldPath && setWorldPath(worldPath.split(sep).slice(0, -1).join(sep))}>
          <UpArrow />
        </IconButton>
    </Box>

        <List dense>
          {dirEntries.map((entry, i) => (
            <ListItemButton key={i} onClick={() => onEntryClick(entry)}>
              <ListItemIcon>
                {entry.isDirectory && <Folder />}
                {entry.isFile && <File />}
              </ListItemIcon>
              <ListItemText>{entry.name}</ListItemText>
            </ListItemButton>
          ))}
        </List>
        
        <Button variant="contained" onClick={selectFile} sx={{ maxWidth: '20em' }}>Select file</Button>
        <p>{content}</p>
      </Stack>
    </main>
  );
}

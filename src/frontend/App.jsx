import React from 'react';
import { useState } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReportIcon from '@mui/icons-material/Report';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import HistoryIcon from '@mui/icons-material/History';
import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Drawer from '@mui/material/Drawer';
import 'jsoneditor/dist/jsoneditor.css';
import JSONEditor from 'jsoneditor';
import jsonToGo from '../util/json-to-go';

const modelStyle = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};

const getHistory = async () => {
    let history = await window.electronAPI.getHistory();
    console.log(history)
    let list = []
    for (let item of history) {
        let exists = await window.electronAPI.exists(item);
        let parts = item.split('/');
        let name = parts.pop();
        list.push({
            dir: parts.join('/'),
            name: name,
            exists: exists
        })
    }
    return list
}

export default function App() {
    const [value, setValue] = React.useState(0);
    const [json, setJSON] = useState({});
    const ref = React.useRef(null);
    const editorRef = React.useRef(null);
    const [height, setHeight] = useState(0);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonModalContent, setJsonModalContent] = useState('');
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState([]);

    React.useEffect(() => {
        if (!editorRef.current) {
            const container = document.getElementById("jsoneditor")
            const options = {
                mode: 'code',
                onValidate: (json) => {
                    console.log(json)
                    window.electronAPI.setRecent(json)
                }
            }
            const editor = new JSONEditor(container, options)
            setHeight(document.documentElement.clientHeight - 74)
            editorRef.current = editor;
            getHistory().then(list => {
                setHistory(list)
            })
            window.electronAPI.getRecent().then(data => {
                editorRef.current.set(data)
            })
        }
        window.onresize = () => {
            setHeight(document.documentElement.clientHeight - 74)
        }

    }, []);

    const toGoStruct = () => {
        let result = jsonToGo(JSON.stringify(editorRef.current.get()), null, null, false);
        setShowJsonModal(true);
        setJsonModalContent(result.go);
    };

    const handleSave = () => {

    }

    const handleFileOpen = async () => {
        let result = await window.electronAPI.openFile();
        console.log(result);
        if (result) {
            let json = await window.electronAPI.readFile(result);
            try {
                editorRef.current.set(JSON.parse(json));
                window.electronAPI.addHistory(result)
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleHistory = async () => {
        let list = await getHistory()
        setHistory(list);
        setOpen(true);
    }

    return (
        <Box sx={{ pb: 7 }} ref={ref}>
            <div id="jsoneditor" style={{ height: height }}></div>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={5}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction label="打开" icon={<FileOpenIcon />} onClick={handleFileOpen} />
                    <BottomNavigationAction label="历史" icon={<HistoryIcon />} onClick={handleHistory} />
                    <BottomNavigationAction label="转GoStruct" icon={<ReportIcon />} onClick={toGoStruct} />
                    <BottomNavigationAction label="保存" icon={<SaveIcon />} onClick={handleSave} />
                </BottomNavigation>
            </Paper>

            <Modal
                open={showJsonModal}
                onClose={() => setShowJsonModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...modelStyle }}>
                    <p id="child-modal-title">Golang JSON Struct</p>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextareaAutosize
                            minRows={4}
                            defaultValue={jsonModalContent}
                            style={{ width: '100%' }}
                        />
                    </Typography>
                </Box>
            </Modal>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 350 }} role="presentation">
                    <List>
                        {history.map((item, index) => (
                            <ListItem button key={index}>
                                <ListItemText primary={item.name} >
                                    {item.dir}
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

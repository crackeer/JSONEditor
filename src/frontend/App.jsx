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
import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';

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

export default function App() {
    const [value, setValue] = React.useState(0);
    const [json, setJSON] = useState({});
    const ref = React.useRef(null);
    const editorRef = React.useRef(null);
    const [height, setHeight] = useState(0);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonModalContent, setJsonModalContent] = useState('');

    React.useEffect(() => {
        console.log(JSONEditor);
        if (!editorRef.current) {
            const container = document.getElementById("jsoneditor")
            const options = {
                mode: 'code',
            }
            const editor = new JSONEditor(container, options)
            setHeight(document.documentElement.clientHeight - 74)
            editorRef.current = editor;
        }
        window.onresize = () => {
            setHeight(document.documentElement.clientHeight - 74)
        }
    }, [json]);

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
            console.log(json);
            try {
                editorRef.current.set(JSON.parse(json));
            } catch (error) {
                console.log(error);
            }
        }
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
        </Box>
    );
}

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
import ExpandIcon from '@mui/icons-material/Expand';
import Snackbar from '@mui/material/Snackbar';
import ReportIcon from '@mui/icons-material/Report';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import CodeOffIcon from '@mui/icons-material/CodeOff';
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

const superDecode = (data) => {
    if (data == null) return data
    if (typeof data == 'string' && (data.startsWith('[') || data.startsWith('{'))) {
        try {
            return JSON.parse(data)
        } catch (e) {
            return data
        }
    }

    if (typeof data == 'object' && data.length == undefined) {
        let retData = {}
        Object.keys(data).forEach(key => {
            retData[key] = superDecode(data[key])
        })
        return retData
    }

    if (typeof data == 'object' && data.length != undefined) {
        let list = []
        for (let i in data) {
            list.push(superDecode(data[i]))
        }
        return list
    }
    return data
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
    const [messageShow, setMessageShow] = useState(false);
    const [message, setMessage] = useState('');

    React.useEffect(() => {
        if (!editorRef.current) {
            const container = document.getElementById("jsoneditor")
            const options = {
                mode: 'code',
                indentation : 4,
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

    const handleSave = async () => {
        let result = await window.electronAPI.saveFile();
        if (result) {
            let json = editorRef.current.get();
            await window.electronAPI.writeFile(result, JSON.stringify(json));
            window.electronAPI.addHistory(result)
            showMessage('保存到' + result + '成功');
        }
    }

    const handleFileOpen = async () => {
        let result = await window.electronAPI.selectFile();
        if (result) {
            loadFile(result)
        }
    }

    const loadFile = async (file) => {
        try {
            let json = await window.electronAPI.readFile(file);
            editorRef.current.set(JSON.parse(json));
            window.electronAPI.addHistory(file)
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    const handleHistory = async () => {
        let list = await getHistory()
        setHistory(list);
        setOpen(true);
    }

    const clickFile = async (item) => {
        console.log(item)
        try {
            let result = await loadFile(item.dir + '/' + item.name);
            if (result) {
                setOpen(false);
            }
        } catch (error) {

        }
    }

    const handleExpand = () => {
        let json = editorRef.current.get();
        editorRef.current.set(superDecode(json));
        
    }

    const showMessage = (message) => {
      setMessage(message);
      setMessageShow(true);
    }

    const stringify = () => {
        let data = JSON.stringify(editorRef.current.get());
        editorRef.current.set(data);
    }

    const parse = () => {
        let data = JSON.parse(editorRef.current.get());
        editorRef.current.set(data);
    }

    const handleCopy =  async() => {
        let data = editorRef.current.get();
        await window.electronAPI.clipboardWriteText(JSON.stringify(data));
        showMessage('复制成功');
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
                    <BottomNavigationAction label="序列化" icon={<CodeOffIcon />} onClick={stringify} />
                    <BottomNavigationAction label="反序列化" icon={<CodeIcon />} onClick={parse} />
                    <BottomNavigationAction label="复制" icon={<ContentCopyIcon />} onClick={handleCopy} />
                    <BottomNavigationAction label="展开" icon={<ExpandIcon />} onClick={handleExpand} />
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
                            maxRows={20}
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
                            <ListItem button={true} key={index} onClick={clickFile.bind(this, item)}>
                                <ListItemText primary={item.name} secondary={item.dir}>
                                    {item.dir}
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Snackbar
                open={messageShow}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={2000}
                onClose={() => setMessageShow(false)}
                message={message}
            />
        </Box>
    );
}

// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Forum from './screens/Forum';
import BookViewer from './screens/BookViewer';
import BookDetails from './components/BookDetails';
import MyAccount from './screens/MyAccount';

import BookReader from './screens/BookReader/BookReader';
import UploadEpub from './utils/UploadEbook';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/register" Component={Register} />
                <Route path="/" Component={Home} />
                <Route path="/book/:id" Component={BookDetails} />
                <Route path="/read/:id" Component={BookViewer} />
                <Route path="/forum" Component={Forum} />
                <Route path="/myaccount" Component={MyAccount} />
                <Route path="/reader/:id" Component={BookReader} />
                <Route path="/upload" Component={UploadEpub} />
            </Routes>
        </Router>
    );
}

export default App;

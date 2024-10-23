// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import BookDetails from './components/BookDetails';
import MyAccount from './screens/MyAccount';
import Forum from './screens/Forum';
import BookReader from './screens/BookReader/BookReader';
import UploadEpub from './utils/UploadEbook';
import Discovery from './screens/Discovery';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/register" Component={Register} />
                <Route path="/" Component={Home} />
                <Route path="/book/:id" Component={BookDetails} />
                <Route path="/reader/:id" Component={BookReader} />
                <Route path="/upload" Component={UploadEpub} />
                <Route path="/myaccount" Component={MyAccount} />
                <Route path="/forum" Component={Forum} />
                <Route path="/discovery" Component={Discovery} />
            </Routes>
        </Router>
    );
}

export default App;
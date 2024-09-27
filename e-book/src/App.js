// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/register" Component={Register} />
                <Route path="/" Component={Home} />
                <Route path="/book/:id" Component={BookDetails} />
                <Route path="/read/:id" Component={BookViewer} />
            </Routes>
        </Router>
    );
}

export default App;

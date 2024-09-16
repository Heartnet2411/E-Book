// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';

function App() {
    return (
        <Router>
            <div>
                {/* Define route */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

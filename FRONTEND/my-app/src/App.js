import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './component/Login'; 
import Signup from './component/Signup'; 
import Dashboard from './component/Dashboard'; 
import AppointmentList from './component/AppointmentList';
import CreateAppointment from './component/CreateAppointment'; 
import UpdateAppointment from './component/UpdateAppointment'; 

function App() {
    return( 
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path="/appointments" element={<AppointmentList />} />
                <Route path="/createappointment" element={<CreateAppointment />} />
                <Route path="/updatebook/:id" element={<UpdateAppointment />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
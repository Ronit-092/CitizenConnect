import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Pages/Home';
import CitizenDashboard from './Pages/CitizenDashboard';
import CitizenSignup from './Pages/CitizenSignup';
import FileComplaint from './Pages/FileComplaint';
import GovtDashboard from './Pages/GovtDashboard';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen-signup" element={<CitizenSignup />} />
            <Route path="/file-complaint" element={<FileComplaint />} />
            <Route path="/govt-dashboard" element={<GovtDashboard />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DevisForm from './pages/DevisForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DevisForm />} />
      </Routes>
    </Router>
  );
}

export default App;
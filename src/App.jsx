import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Composants layout
import Layout from './Components/Layout/Layout';

// Pages (à implémenter progressivement)
import HomePage from './Pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* Autres routes à ajouter progressivement */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

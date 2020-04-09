import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './styles/App.scss';

const Home = lazy(() => import('./pages/HomeScreen'));
const Barcode = lazy(() => import('./pages/BarcodeScreen'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/barcodes">Scan Barcodes</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/barcodes">
            <Barcode />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
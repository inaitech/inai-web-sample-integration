import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DropIn from './component/Dropin';
import Checkout from './component/Checkout';
import Product from './component/Product';
import SuccessPage from './component/SuccessPage';
import FailurePage from './component/FailurePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<DropIn />} />
        <Route exact path='/product' element={<Product />} />
        <Route exact path='/checkout' element={<Checkout />} />
        <Route exact path='/success' element={<SuccessPage />} />
        <Route exact path='/failure' element={<FailurePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

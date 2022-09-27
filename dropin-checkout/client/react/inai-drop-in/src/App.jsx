import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DropIn from './component/Dropin';
import Payment from './component/Payment';
import Product from './component/Product';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<DropIn />} />
        <Route exact path='/product' element={<Product />} />
        <Route exact path='/payment' element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

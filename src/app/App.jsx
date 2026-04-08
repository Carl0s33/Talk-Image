import { RouterProvider } from 'react-router';
import { roteador } from './routes';
import './Aplicacao.css';

function Aplicacao() {
  return <RouterProvider router={roteador} />;
}

export default Aplicacao;

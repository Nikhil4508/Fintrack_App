import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';

const Applayout = () => {
  return (
    <div className="flex min-h-screen h-screen flex-col">
      <Header/>
      <div className="flex flex-1">
        <Sidebar/>
        <main className='flex-1 p-6 overflow-y-auto bg-[var(--background-main)]'>
          <Outlet/>
        </main>
      </div>
      <Footer/>
    </div>
  );
}

export default Applayout;
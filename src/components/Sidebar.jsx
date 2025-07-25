import { NavLink } from 'react-router-dom';
import { House, CreditCard, ChartLine, PiggyBank, Repeat ,Settings} from 'lucide-react';



const navlinks = [
  {id:1, name:"Overview", icon:House, href:"/dashboard"},
  {id:2, name:"Transactions", icon:CreditCard, href:"/transactions"},
  {id:3, name:"Budgets", icon:ChartLine, href:"/budgets"},
  {id:4, name:"Savings Goals", icon:PiggyBank, href:"/savingsgoals"},
  {id:5, name:"Setting", icon:Settings, href:"/settings"},
];

const Sidebar = () => {
  return (
    <aside className='group flex h-full w-16 flex-col items-center border-r border-[var(--border-color)] bg-[var(--background-color)] py-4 transition-all duration-300 hover:w-64 md:w-64'>
      <div className="flex flex-1 flex-col gap-2 px-2 py-4 w-full ">
        {navlinks.map((items) => {
          const Icon = items.icon;
          return (
            <NavLink
              key={items.id}
              to={items.href}
              style={({isActive})=>({background: isActive ?"var(--nav-bg-active)":"",color: isActive ? "var(--nav-text-active)":"" })}
              className="flex h-10 items-center rounded-md px-3 text-sm text-[var(--heading-text)] font-medium transition-colors hover:bg-[var(--sub-background-color)]"
            >
              <Icon className="mr-2 h-5 w-5" />
              <span className="hidden group-hover:inline-block md:inline-block">{items.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  )
}

export default Sidebar

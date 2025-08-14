// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";
import RTLPage from "views/Dashboard/RTL";
import Profile from "views/Dashboard/Profile";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Rooms from "views/Dashboard/Rooms";
import Bookings from "views/Dashboard/Bookings";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import {
  FaHome,
  FaBed,
  FaUserAlt,
  FaExchangeAlt,
  FaChair,
} from "react-icons/fa";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <FaHome color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/user",
  },
  {
    path: "/rooms",
    name: "Rooms",
    rtlName: "لوحة القيادة",
    icon: <FaBed color="inherit" />,
    component: Rooms,
    layout: "/admin",
  },
  {
    path: "/bookings",
    name: "Bookings",
    rtlName: "لوحة القيادة",
    icon: <FaExchangeAlt color="inherit" />,
    component: Bookings,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Inventory",
    rtlName: "لوحة القيادة",
    icon: <FaChair color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "لوحة القيادة",
    icon: <FaUserAlt color="inherit" />,
    secondaryNavbar: true,
    component: Profile,
    layout: "/admin",
  },
  // {
  //   path: "/rtl-support-page",
  //   name: "RTL",
  //   rtlName: "آرتيإل",
  //   icon: <SupportIcon color="inherit" />,
  //   component: RTLPage,
  //   layout: "/rtl",
  // },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color="inherit" />,
        secondaryNavbar: true,
        component: SignUp,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;

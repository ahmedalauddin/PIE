const Menu = [
  {
    label: "Dashboard",
    pathname: "/paneldashboard",
    admin: false,
    intro: false
  },
  {
    label: "Login",
    pathname: "/login",
    admin: false,
    intro: true
  },
  {
    label: "Mind Map",
    pathname: "/mindmap",
    admin: true,
    intro: false
  },
  {
    label: "Projects",
    pathname: "/listprojects",
    admin: true,
    intro: false
  },
  {
    label: "Organizations",
    pathname: "/orgdashboard",
    admin: true,
    intro: false
  },
/*
  {
    label: "Analytics",
    pathname: "/analytics"
  }, */
  {
    label: "Client Filter",
    pathname: "/clientorg",
    admin: true,
    intro: false
  },
  {
    label: "Logout",
    pathname: "/logout"
  },
  {
    label: "About",
    pathname: "/about",
    admin: false,
    intro: true
  }
];

export default Menu;

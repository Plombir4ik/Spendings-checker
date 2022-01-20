import React, { useContext } from "react"
import {NavLink, useNavigate} from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export const NavBar = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    
    const logout = event => {
        event.preventDefault()
        auth.logout()
        navigate("/")
    }

    const [touched, touchedSet] = React.useState(false)

    return(
        <nav>
        <div class="nav-wrapper indigo darken-1" style={{padding : "0 2rem"}}>
          <label  class="brand-logo" style={{ opacity: touched ? 0.5 : 1, transition: 'opacity 300ms ease' }} 
          onClick={() => navigate("/categories")}
          onMouseDown={() => touchedSet(true)}
          onMouseUp={() => touchedSet(false)}
          >
            Spendings-checker
            </label>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><NavLink to="/categories">Categories</NavLink></li>
            <li><NavLink to="/transactions">Transactions</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><a href="/" onClick={logout}>Logout</a></li>
          </ul>
        </div>
      </nav>
    )
}
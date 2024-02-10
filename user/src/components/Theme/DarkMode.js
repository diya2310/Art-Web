import React, { useEffect, useState } from "react";
import { ReactComponent as Sun } from "../../assets/icons/Sun.svg";
import { ReactComponent as Moon } from "../../assets/icons/Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {

    const [theme, setTheme] = useState(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
        else setTheme('light');
    },[])

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    },[theme])

    const handleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    // const SetDarkMode = () => {
    //     document.querySelector("body").setAttribute("data-theme", "dark");
    // };
    
    // const SetLightMode = () => {
    //     document.querySelector("body").setAttribute("data-theme", "light");
    // };

    // const toggleTheme = (e) => {
    //     if (e.target.checked) SetDarkMode();
    //     else SetLightMode()
    // }

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={handleTheme}
            />
            <label className='dark_mode_label'>
                <Sun />
                <Moon />
            </label>
        </div>
    );

};

export default DarkMode;

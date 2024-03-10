import React,{ 
  useState,
  createContext,
  useLayoutEffect,
} from "react";
import themes from "../utils/theme";
import { setString, getString } from '../utils/storage';

export const ThemeContext = createContext()
const defaultTheme = 'default';
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme)
  const [showPost, setShowPost] = useState(false);

  useLayoutEffect(()=> {
    getString('theme').then((data)=> {
      if(data === null){
        setString('theme', 'default')
        setTheme('default')
      }else{
        setTheme(data)
      }
    })
    getString('showPost').then((data)=>{
      if(data === null){
        setString('showPost', 'false')
        setShowPost(false)
      }else{
        setShowPost(data === 'true' ? true : false)
      }
    })
  }, [])

  return (
    <ThemeContext.Provider
      value={{ theme: themes[theme] || themes[defaultTheme], setTheme
      , showPost, setShowPost}}
    >
      {children}
    </ThemeContext.Provider>
  )
}

import defaultTheme from './default';
import dark from './dark';

const themes = {
  default: defaultTheme,
  dark,
}

// 支持添加主题
export const addTheme = (key, value) => (themes[key] = value)

export default themes;
export const ui = {
  en: {
    nav: { home: 'Home', writing: 'Writing', ideas: 'Ideas', work: 'Work', about: 'About' },
    primaryNav: 'Primary',
    skip: 'Skip to content',
    darkTheme: 'Dark theme',
    dark: 'Dark',
    language: 'Language: English',
    languageName: 'English',
    location: 'Texas',
    imageAlt: 'Dastan Aitzhanov, AI systems builder and writer',
  },
  ru: {
    nav: { home: 'Главная', writing: 'Тексты', ideas: 'Идеи', work: 'Работы', about: 'Обо мне' },
    primaryNav: 'Основная навигация',
    skip: 'Перейти к содержанию',
    darkTheme: 'Тёмная тема',
    dark: 'Тёмная',
    language: 'Язык: русский',
    languageName: 'Русский',
    location: 'Техас',
    imageAlt: 'Дастан Айтжанов, разработчик ИИ-систем и автор',
  },
} as const;

export type SourceLocale = keyof typeof ui;

export function sourceLocale(pathname: string): SourceLocale {
  return pathname.startsWith('/ru/') || pathname === '/ru' ? 'ru' : 'en';
}

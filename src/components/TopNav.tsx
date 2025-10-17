import { Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const TopNav = () => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('uyir_lang', newLang);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">உ</span>
          </div>
          <span className="text-xl font-bold">Uyirkappan</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/partner" aria-label="Driver Portal">Driver Portal</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

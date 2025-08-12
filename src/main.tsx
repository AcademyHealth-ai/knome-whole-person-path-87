import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupAuthDeepLinks } from './auth/handleDeepLink';

setupAuthDeepLinks();

createRoot(document.getElementById("root")!).render(<App />);


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '../../css/backoffice.css';

createRoot(document.getElementById('admin-root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

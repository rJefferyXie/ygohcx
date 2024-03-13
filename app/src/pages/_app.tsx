// React + Next
import type { AppProps } from 'next/app';

// Tailwind
import '@/styles/globals.scss';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="flex">
      <Component {...pageProps}/>
    </div>
  );
}

export default App;
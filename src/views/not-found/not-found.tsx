import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './not-found.module.css';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import useTheme from '../../hooks/use-theme';

const totalNotFoundImages = 2;

const NotFoundImage = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalNotFoundImages) + 1;
    const cacheBuster = new Date().getTime();
    return `assets/not-found/not-found-${randomBannerIndex}.jpg?cacheBuster=${cacheBuster}`;
  });

  return <img src={imagePath} alt='' />;
};

const NotFound = () => {
  const { subplebbitAddress } = useParams();

  const [theme, setTheme] = useTheme();
  const previousThemeRef = useRef(theme);

  useEffect(() => {
    if (theme !== 'yotsuba') {
      previousThemeRef.current = theme;
      setTheme('yotsuba');
    }

    return () => {
      if (theme === 'yotsuba') {
        setTheme(previousThemeRef.current);
      }
    };
  }, [theme, setTheme]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Link to='https://guac.chat/' target='_blank' rel='noopener noreferrer'>
          <div className={styles.logo}>
            <img alt='' src='/assets/logo/logo-transparent.png' />
          </div>
        </Link>
        <div className={styles.boxOuter}>
          <div className={styles.boxInner}>
            <div className={styles.boxBar}>
              <h2>404 Not Found</h2>
            </div>
            <div className={styles.boxContent}>
              <NotFoundImage />
              {subplebbitAddress && (
                <>
                  <br />
                  <div className={styles.backToBoard}>
                    [<Link to={`/p/${subplebbitAddress}`}>Back to p/{Plebbit.getShortAddress(subplebbitAddress)}</Link>]
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isCatalogView } from '../../lib/utils/view-utils';
import styles from './board-nav.module.css';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';

interface BoardNavProps {
  subplebbitAddresses: string[];
  subplebbitAddress?: string;
}

const BoardNavDesktop = ({ subplebbitAddresses }: BoardNavProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const isInCatalogView = isCatalogView(location.pathname, params);

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
        [
        {subplebbitAddresses.map((address: string, index: number) => {
          return (
            <span key={index}>
              {index === 0 ? null : ' '}
              <Link to={`/p/${address}${isInCatalogView ? '/catalog' : ''}`}>{address.includes('.') ? address : address.slice(0, 10).concat('...')}</Link>
              {index !== subplebbitAddresses.length - 1 ? ' /' : null}
            </span>
          );
        })}
        ]
      </span>
      <span className={styles.navTopRight}>
        [
        <Link to={'https://guac.chat'} target='_blank' rel='noopener noreferrer'>
          {t('Guac Chat')}
        </Link>
        ] [<Link to='/settings'>{t('settings')}</Link>] [<Link to='/'>{t('home')}</Link>]
      </span>
    </div>
  );
};

const BoardNavMobile = ({ subplebbitAddresses, subplebbitAddress }: BoardNavProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const displaySubplebbitAddress = subplebbitAddress && subplebbitAddress.length > 30 ? subplebbitAddress.slice(0, 30).concat('...') : subplebbitAddress;

  const currentSubplebbitIsInList = subplebbitAddresses.some((address: string) => address === subplebbitAddress);

  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  const boardSelect = (
    <select value={subplebbitAddress || 'all'} onChange={(e) => navigate(`/p/${e.target.value}${isInCatalogView ? '/catalog' : ''}`)}>
      {!currentSubplebbitIsInList && subplebbitAddress && <option value={subplebbitAddress}>{displaySubplebbitAddress}</option>}
      <option value='all'>{t('all')}</option>
      <option value='subscriptions'>{t('subscriptions')}</option>
      {subplebbitAddresses.map((address: any, index: number) => {
        const subplebbitAddress = address?.includes('.') ? address : address?.slice(0, 10).concat('...');
        return (
          <option key={index} value={address}>
            {subplebbitAddress}
          </option>
        );
      })}
    </select>
  );

  return (
    <div className={styles.boardNavMobile} id='sticky-menu'>
      <div className={styles.boardSelect}>
        <strong>{t('board')}</strong>
        {boardSelect}
      </div>
      <div className={styles.pageJump}>
        <Link to={'https://guac.chat'} target='_blank' rel='noopener noreferrer'>
          {t('Guac Chat')}
        </Link>
        <Link to={useLocation().pathname + '/settings'}>{t('settings')}</Link>
        <Link to='/'>{t('home')}</Link>
      </div>
    </div>
  );
};

// sticky menu animation
// will trigger more than once with hot reloading during development
if (!window.STICKY_MENU_SCROLL_LISTENER) {
  window.STICKY_MENU_SCROLL_LISTENER = true;

  const scrollRange = 50; // the animation css px range in stickyMenuAnimation, must also edit css animation 100%: {top}
  let currentScrollInRange = 0,
    previousScroll = 0;

  window.addEventListener('scroll', () => {
    // find difference between current and last scroll position
    const currentScroll = window.scrollY;
    const scrollDifference = currentScroll - previousScroll;
    previousScroll = currentScroll;

    // find new current scroll in range
    const previousScrollInRange = currentScrollInRange;
    currentScrollInRange += scrollDifference;
    if (currentScrollInRange > scrollRange) {
      currentScrollInRange = scrollRange;
    } else if (currentScrollInRange < 0) {
      currentScrollInRange = 0;
    }

    // fix mobile overflow scroll bug
    if (currentScroll <= 0) {
      currentScrollInRange = 0;
    }

    // no changes
    if (currentScrollInRange === previousScrollInRange) {
      return;
    }

    // Get the menu element
    const menuElement = document.getElementById('sticky-menu');
    if (!menuElement) {
      return;
    }

    // control progress of the animation using negative animation-delay (0 to -1s)
    const animationPercent = currentScrollInRange / scrollRange;
    menuElement.style.animationDelay = animationPercent * -1 + 's';
  });
}

const BoardNav = () => {
  const subplebbitAddresses = useDefaultSubplebbitAddresses();

  const params = useParams();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <>
      <BoardNavDesktop subplebbitAddresses={subplebbitAddresses} />
      <BoardNavMobile subplebbitAddresses={subplebbitAddresses} subplebbitAddress={subplebbitAddress} />
    </>
  );
};

export default BoardNav;

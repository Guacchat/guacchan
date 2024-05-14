import { useRef, useMemo, useState, useEffect } from 'react';
import styles from './home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Comment, Subplebbit, useFeed, useSubplebbit, useSubplebbitStats, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import packageJson from '../../../package.json';
import useDefaultSubplebbits, { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { CatalogPostMedia } from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';
import _ from 'lodash';
import CatalogRow from '../../components/catalog-row';
import useWindowWidth from '../../hooks/use-window-width';

const isValidAddress = (address: string): boolean => {
  if (address.includes('/') || address.includes('\\') || address.includes(' ')) {
    return false;
  }
  return true;
};

const SearchBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    const inputValue = searchInputRef.current?.value;
    if (inputValue && isValidAddress(inputValue)) {
      navigate(`/p/${inputValue}`);
    } else {
      alert('invalid address');
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        autoCorrect='off'
        autoComplete='off'
        spellCheck='false'
        autoCapitalize='off'
        type='text'
        placeholder={`"board.eth/.sol" ${t('or')} "12D3KooW..."`}
        ref={searchInputRef}
        onSubmit={handleSearchSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchSubmit();
          }
        }}
      />
      <button onClick={handleSearchSubmit}>{t('go')}</button>
    </div>
  );
};

const InfoBox = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.box}>
      <div className={styles.infoboxBar}>
        <h2>{t('what_is_guacchan')}</h2>
      </div>
      <div className={styles.boxContent}>
        <Trans
          i18nKey='guacchan_description'
          shouldUnescape={true}
          components={{
            1: <Link to='https://plebbit.com/' target='_blank' rel='noopener noreferrer' />,
            2: <Link to='https://plebchan.eth.limo/' target='_blank' rel='noopener noreferrer' />,
          }}
        />
        <br />
        <br />
        <Trans i18nKey='no_global_rules_info' shouldUnescape={true} components={{ 1: <Link to='https://guac.chat/' target='_blank' rel='noopener noreferrer' /> }} />
      </div>
    </div>
  );
};

const Boards = ({ subplebbits }: { subplebbits: (Subplebbit | undefined)[] }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.box}>
      <div className={styles.boxBar}>
        <h2 className={styles.capitalize}>{t('boards')}</h2>
        {/* <span>{t('options')} ▼</span> */}
      </div>
      <div className={styles.boardsBoxContent}>
        <div className={styles.column}>
          <h3>{t('Business And Finance')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (
                  address.includes('business') ||
                  address.includes('finance') ||
                  address.includes('whales') ||
                  address.includes('bitcoin') ||
                  address.includes('comfy') ||
                  address.includes('token')
                ) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('Politics and Global News')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (address.includes('politically') || address.includes('incorrect') || address.includes('politics') || address.includes('news')) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('Entertainment')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (
                  address.includes('music') ||
                  address.includes('videos') ||
                  address.includes('podcast') ||
                  address.includes('💩posting') ||
                  address.includes('cringe') ||
                  address.includes('movies') ||
                  address.includes('anime')
                ) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('Health and Science')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (address.includes('health') || address.includes('science') || address.includes('weather')) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('Pleb Community & Social')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (address.includes('pleb') || address.includes('reddit') || address.includes('social') || address.includes('twitter')) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('Others')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (
                  !address.includes('politically') &&
                  !address.includes('incorrect') &&
                  !address.includes('business') &&
                  !address.includes('finance') &&
                  !address.includes('whales') &&
                  !address.includes('bitcoin') &&
                  !address.includes('politics') &&
                  !address.includes('news') &&
                  !address.includes('music') &&
                  !address.includes('videos') &&
                  !address.includes('movies') &&
                  !address.includes('anime') &&
                  !address.includes('podcast') &&
                  !address.includes('💩posting') &&
                  !address.includes('cringe') &&
                  !address.includes('bitcoin') &&
                  !address.includes('health') &&
                  !address.includes('science') &&
                  !address.includes('pleb') &&
                  !address.includes('redit') &&
                  !address.includes('rules') &&
                  !address.includes('modderate') &&
                  !address.includes('moderator') &&
                  !address.includes('censorship')
                ) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        {/* <div className={styles.column}>
          <h3>{t('Moderating')}</h3>
          <div className={styles.list}>
            {subplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                if (address.includes('rules') || address.includes('modderate') || address.includes('moderator') || address.includes('censorship')) {
                  return (
                    <div className={styles.subplebbit} key={address}>
                      <Link to={`/p/${address}`}>{address}</Link>
                    </div>
                  );
                }
              })}
          </div>
        </div> */}
      </div>
    </div>
  );
};

const columnWidth = 180;

const BizThreads = () => {
  const { t } = useTranslation();
  const subplebbitAddress = 'business-and-finance.eth';
  const subplebbitAddress2 = '';
  const subplebbitAddresses = useMemo(() => [subplebbitAddress, subplebbitAddress2], [subplebbitAddress]) as string[];
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const columnCount = Math.floor(useWindowWidth() / columnWidth);
  const { shortAddress, state, title } = subplebbit || {};
  const postsPerPage = useMemo(() => (columnCount <= 2 ? 3 : columnCount === 3 ? 3 : columnCount === 4 ? 3 : 3), []);
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses, sortType: 'active', postsPerPage });
  const isFeedloaded = feed.length > 0 || state === 'failed';
  const rows = useFeedRows(columnCount, feed, isFeedloaded, subplebbit);
  const stats = useSubplebbitStats({ subplebbitAddress: subplebbitAddress });
  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>
          {title}
          &nbsp;-&nbsp;
          <Link to={`/p/${shortAddress}`}>{shortAddress}</Link>
        </h2>
        {/* <span>{t('options')} ▼</span> */}
      </div>
      <div className={styles.boxContent}>
        {rows.map((row, index) => {
          return (
            <div>
              <CatalogRow index={index} row={row} />
              <tbody>
                <tr>
                  <td>
                    <Trans
                      i18nKey='board_stats_hour'
                      values={{ userCount: stats.hourActiveUserCount, postCount: stats.hourPostCount }}
                      components={{ 1: <span className={styles.statValue} /> }}
                    />
                    {' / '}
                    <Trans
                      i18nKey='board_stats_day'
                      values={{ userCount: stats.dayActiveUserCount, postCount: stats.dayPostCount }}
                      components={{ 1: <span className={styles.statValue} /> }}
                    />
                  </td>
                </tr>
              </tbody>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const BitcoinThreads = () => {
  const { t } = useTranslation();
  const subplebbitAddress = 'bitcoinbrothers.eth';
  const subplebbitAddress2 = '';
  const subplebbitAddresses = useMemo(() => [subplebbitAddress, subplebbitAddress2], [subplebbitAddress]) as string[];
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const columnCount = Math.floor(useWindowWidth() / columnWidth);
  const { shortAddress, state, title } = subplebbit || {};
  const postsPerPage = useMemo(() => (columnCount <= 2 ? 3 : columnCount === 3 ? 3 : columnCount === 4 ? 3 : 3), []);
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses, sortType: 'active', postsPerPage });
  const isFeedloaded = feed.length > 0 || state === 'failed';
  const rows = useFeedRows(columnCount, feed, isFeedloaded, subplebbit);
  const stats = useSubplebbitStats({ subplebbitAddress: subplebbitAddress });
  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>
          {title}
          &nbsp;-&nbsp;
          <Link to={`/p/${shortAddress}`}>{shortAddress}</Link>
        </h2>
        {/* <span>{t('options')} ▼</span> */}
      </div>
      <div className={styles.boxContent}>
        {rows.map((row, index) => {
          return (
            <div>
              <CatalogRow index={index} row={row} />
              <tbody>
                <tr>
                  <td>
                    <Trans
                      i18nKey='board_stats_hour'
                      values={{ userCount: stats.hourActiveUserCount, postCount: stats.hourPostCount }}
                      components={{ 1: <span className={styles.statValue} /> }}
                    />
                    {' / '}
                    <Trans
                      i18nKey='board_stats_day'
                      values={{ userCount: stats.dayActiveUserCount, postCount: stats.dayPostCount }}
                      components={{ 1: <span className={styles.statValue} /> }}
                    />
                  </td>
                </tr>
              </tbody>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PopularThreadProps {
  post: Comment;
  boardTitle: string | undefined;
  boardShortAddress: string;
}

const PopularThreadCard = ({ post, boardTitle, boardShortAddress }: PopularThreadProps) => {
  const { cid, content, subplebbitAddress, title } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);

  return (
    <div className={styles.popularThread} key={cid}>
      <div className={styles.title}>{boardTitle || boardShortAddress}</div>
      <div className={styles.mediaContainer}>
        <Link to={`/p/${subplebbitAddress}/c/${cid}`}>
          <CatalogPostMedia commentMediaInfo={commentMediaInfo} />
        </Link>
      </div>
      <div className={styles.threadContent}>
        {title && <b>{title}</b>}
        {content && (content.length > 99 ? `: ${content.substring(0, 99)}...` : `: ${content}`)}
      </div>
    </div>
  );
};

const MostRecentThreads = ({ popularPosts }: { popularPosts: any[] }) => {
  const { t } = useTranslation();
  // const subplebbitAddress = 'politically-incorrect.eth';
  // const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress]) as string[];
  // const subplebbit = useSubplebbit({ subplebbitAddress });
  // const columnCount = Math.floor(useWindowWidth() / columnWidth);
  // const { state } = subplebbit || {};
  // const postsPerPage = useMemo(() => (columnCount <= 2 ? 3 : columnCount === 3 ? 3 : columnCount === 4 ? 3 : 3), []);
  // const { feed } = useFeed({ subplebbitAddresses, sortType: 'active', postsPerPage });
  // const isFeedloaded = feed.length > 0 || state === 'failed';

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('Latest Threads')}</h2>
        {/* <span>{t('options')} ▼</span> */}
      </div>
      <div className={`${styles.boxContent} ${popularPosts.length === 8 ? styles.popularThreads : ''}`}>
        {popularPosts.length < 8 ? (
          <span className={styles.loading}>
            <LoadingEllipsis string={t('loading')} />
          </span>
        ) : (
          popularPosts.map((post: any, index: number) => {
            if (index < 8) {
              return (
                <PopularThreadCard key={post.cid} post={post} boardTitle={post.subplebbitTitle || post.subplebbitAddress} boardShortAddress={post.subplebbitAddress} />
              );
            }
          })
        )}
      </div>
    </div>
  );
};

const PopularThreadsB = ({ popularPosts }: { popularPosts: any[] }) => {
  const { t } = useTranslation();
  // const subplebbitAddress = 'politically-incorrect.eth';
  // const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress]) as string[];
  // const subplebbit = useSubplebbit({ subplebbitAddress });
  // const columnCount = Math.floor(useWindowWidth() / columnWidth);
  // const { state } = subplebbit || {};
  // const postsPerPage = useMemo(() => (columnCount <= 2 ? 3 : columnCount === 3 ? 3 : columnCount === 4 ? 3 : 3), []);
  // const { feed } = useFeed({ subplebbitAddresses, sortType: 'active', postsPerPage });
  // const isFeedloaded = feed.length > 0 || state === 'failed';
  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('Popular Threads')}</h2>
        {/* <span>{t('options')} ▼</span> */}
      </div>
      <div className={`${styles.boxContent} ${popularPosts.length === 8 ? styles.popularThreads : ''}`}>
        {popularPosts.length < 8 ? (
          <span className={styles.loading}>
            <LoadingEllipsis string={t('loading')} />
          </span>
        ) : (
          popularPosts.map((post: any) => (
            <PopularThreadCard key={post.cid} post={post} boardTitle={post.subplebbitTitle || post.subplebbitAddress} boardShortAddress={post.subplebbitAddress} />
          ))
        )}
      </div>
    </div>
  );
};

const { version } = packageJson;
const downloadAppLink = (() => {
  const platform = navigator.platform;
  if (platform === 'Linux' || platform === 'Linux x86_64' || platform === 'Linux i686' || platform === 'Linux aarch64') {
    return `https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.AppImage`;
  } else if (platform === 'Win32' || platform === 'Win64' || platform === 'Windows') {
    return `https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan.Portable.${version}.exe`;
  } else if (platform === 'MacIntel' || platform === 'Macintosh') {
    return `https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.dmg`;
  } else if (platform === 'Android') {
    return undefined;
  } else if (platform === 'iPhone' || platform === 'iPad') {
    return undefined;
  } else {
    return undefined;
  }
})();

const isElectron = window.isElectron === true;
const commitRef = process.env.REACT_APP_COMMIT_REF;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <ul className={styles.footer}>
        <li>
          <a href='https://plebbit.com' target='_blank' rel='noopener noreferrer'>
            {t('about')}
          </a>
        </li>
        <li>
          <a href='https://twitter.com/guacchat' target='_blank' rel='noopener noreferrer'>
            Twitter
          </a>
        </li>
        <li>
          <a href='https://t.me/guacchat' target='_blank' rel='noopener noreferrer'>
            Telegram
          </a>
        </li>
        <li>
          <a href='https://discord.gg/E7ejphwzGW' target='_blank' rel='noopener noreferrer'>
            Discord
          </a>
        </li>
        <li>
          <a href='https://github.com/plebbit/plebchan' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
        </li>
        {/* {downloadAppLink && (
          <li>
            <a href={downloadAppLink} target='_blank' rel='noopener noreferrer'>
              {t('download_app')}
            </a>
          </li>
        )} */}
        <li>
          <a href='https://launchonbase.today/token/0x7c0e376Ee81435cfFDd852D97De3E93bCB64E438' target='_blank' rel='noopener noreferrer'>
            {t('token')}
          </a>
        </li>
        <li>
          <a href='https://github.com/plebbit/whitepaper/discussions/2' target='_blank' rel='noopener noreferrer'>
            {t('whitepaper')}
          </a>
        </li>
      </ul>
      <div className={styles.version}>
        <a href={`https://github.com/plebbit/plebchan/releases/tag/v${packageJson.version}`} target='_blank' rel='noopener noreferrer'>
          v{packageJson.version}
        </a>
        {isElectron && (
          <a className={styles.fullNodeStats} href='http://localhost:5001/webui/' target='_blank' rel='noreferrer'>
            node stats
          </a>
        )}
        {commitRef && (
          <a href={`https://github.com/plebbit/plebchan/commit/${commitRef}`} target='_blank' rel='noopener noreferrer'>
            #{commitRef.slice(0, 7)}
          </a>
        )}
      </div>
    </>
  );
};

const useFeedRows = (columnCount: number, feed: any, isFeedLoaded: boolean, subplebbit: Subplebbit) => {
  const { t } = useTranslation();
  const { address, createdAt, description, rules, shortAddress, suggested, title } = subplebbit || {};
  const { avatarUrl } = suggested || {};

  const feedWithDescriptionAndRules = useMemo(() => {
    if (!isFeedLoaded) {
      return []; // prevent rules and description from appearing while feed is loading
    }
    if (!description && !rules) {
      return feed;
    }
    const _feed = [...feed];
    return _feed;
  }, [feed, description, rules, address, isFeedLoaded, createdAt, title, shortAddress, avatarUrl, t]);

  // Memoize rows calculation, ensuring it updates on changes to the modified feed or column count
  const rows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < feedWithDescriptionAndRules.length; i += columnCount) {
      rows.push(feedWithDescriptionAndRules.slice(i, i + columnCount));
    }
    return rows;
  }, [feedWithDescriptionAndRules, columnCount]);

  return rows;
};

const Home = () => {
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });
  const blacklisted = ['decentralizedscam.eth'];
  const filteredSubplebits = subplebbits
    .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
    .map((subplebbit: Subplebbit) => {
      const address = subplebbit.address;
      if (!blacklisted.includes(address)) {
        _.debounce(() => {
          AddBoardStats(address);
        }, [100]);
        return subplebbit;
      }
    });
  const [newPosts, setNewPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  useEffect(() => {
    let subplebbitToPost: any = {};
    filteredSubplebits.forEach((subplebbit: any) => {
      let mostRecentPost = null;
      if (subplebbit?.posts?.pages?.hot?.comments) {
        for (const comment of Object.values(subplebbit.posts.pages.hot.comments) as Comment[]) {
          const { deleted, locked, pinned, removed, timestamp, replyCount } = comment;
          const commentMediaInfo = getCommentMediaInfo(comment);
          const isMediaShowed = getHasThumbnail(commentMediaInfo, comment.link);
          if (isMediaShowed && !removed && !deleted && !locked && !pinned && !newPosts.includes(comment)) {
            if (newPosts.length && timestamp > newPosts[0].timestamp) {
              setNewPosts((prev: any) => [comment, ...prev]); // Add to beginning for most recent
            } else {
              setNewPosts((prev: any) => [...prev, comment]);
            }
          }
          if (
            isMediaShowed &&
            replyCount >= 2 &&
            !removed &&
            !deleted &&
            !locked &&
            !pinned && // criteria
            timestamp > Date.now() / 1000 - 60 * 60 * 24 * 15 // 30 days
          ) {
            if (!mostRecentPost || comment.timestamp > mostRecentPost.timestamp) {
              mostRecentPost = comment;
            }
          }

          if (mostRecentPost) {
            subplebbitToPost[subplebbit.address] = mostRecentPost;
          }
        }
      }
    });
    const newPopularPosts: any = Object.values(subplebbitToPost)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, 8);

    setPopularPosts(newPopularPosts);
  }, [subplebbits]);

  const [allUserCount, setAllUserCount] = useState(0);
  const [allPostCount, setAllPostCount] = useState(0);

  const AddBoardStats = (address: string) => {
    const stats = useSubplebbitStats({ subplebbitAddress: address });

    setAllUserCount((prev) => prev + stats.allActiveUserCount);
    setAllPostCount((prev) => prev + stats.allPostCount);
  };
  const totalBoards = subplebbits.length;
  const Stats = ({ subplebbits }: { subplebbits: (Subplebbit | undefined)[] }) => {
    const { t } = useTranslation();
    return (
      <div className={styles.box}>
        <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
          <h2 className={styles.capitalize}>{t('stats')}</h2>
        </div>
        <div className={styles.boxContent}>
          There are a total of {totalBoards} Boards with {allPostCount} posts and {allUserCount} users
        </div>
      </div>
    );
  };

  return (
    <div className={styles.content}>
      <Link to='https://guac.chat/' target='_blank' rel='noopener noreferrer'>
        <div className={styles.logo}>
          <img alt='' src='/assets/logo/logo-transparent.png' />
        </div>
      </Link>
      <SearchBar />
      <InfoBox />
      <Boards subplebbits={filteredSubplebits} />
      <MostRecentThreads popularPosts={newPosts} />
      <PopularThreadsB popularPosts={popularPosts} />
      <BizThreads />
      <BitcoinThreads />
      <Stats subplebbits={filteredSubplebits} />
      <Footer />
    </div>
  );
};

export default Home;

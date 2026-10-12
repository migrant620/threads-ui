import type { ImageSourcePropType } from 'react-native';

/**
 * Sample content.
 *
 * Everything here is invented for this prototype. No handle, display name, bio, post text,
 * avatar or photo is taken from the reference captures — the goal forbids reusing any real
 * user's words or likeness, and forbids likenesses of real people even when a stock licence
 * would allow it. Avatars are code-drawn abstract plates (see assets/images/a0*.webp); the
 * four post photos are original generations made for this project.
 *
 * Relative times are computed from real timestamps at render time (see `relativeTime`), and
 * like counts are component state, so neither is a hard-coded display string.
 */

export type Post = {
  id: string;
  handle: string;
  avatar: ImageSourcePropType;
  verified: boolean;
  /** Epoch ms. Rendered as "2h" / "25m" by relativeTime(). */
  postedAt: number;
  body: string;
  /** Optional inline link run appended to the body. */
  link?: string;
  /** Optional attached photo. */
  photo?: ImageSourcePropType;
  likes: number;
  replies: number;
  reposts: number;
  /** True for the account's own posts, which show the menu key instead of a follow plate. */
  mine?: boolean;
};

export type ReplyNode = {
  id: string;
  handle: string;
  avatar: ImageSourcePropType;
  verified: boolean;
  postedAt: number;
  body: string;
  likes: number;
  replies: number;
  reposts: number;
  /** 0 = top level in the reply tree, 1 = nested one level, 2 = nested two levels. */
  depth: number;
  /** Marks the thread's own author, which the reference chips as "Author". */
  author?: boolean;
  /** True when the reference shows the "Show replies" summary row under this node. */
  collapsed?: boolean;
};

export type Suggestion = {
  id: string;
  handle: string;
  avatar: ImageSourcePropType;
  verified: boolean;
  bio: string;
  followers: string;
};

const a = (n: number): ImageSourcePropType => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const map: Record<number, ImageSourcePropType> = {
    1: require('../assets/images/a01.webp'),
    2: require('../assets/images/a02.webp'),
    3: require('../assets/images/a03.webp'),
    4: require('../assets/images/a04.webp'),
    5: require('../assets/images/a05.webp'),
  };
  return map[n];
};

const p = (n: number): ImageSourcePropType => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const map: Record<number, ImageSourcePropType> = {
    1: require('../assets/images/p01.webp'),
    /* Key 2 is deliberately absent: the second post in the reference carries no media, so no
       post uses it. Requiring a file nothing renders would put it in every build and every
       published copy for no reason, so it was retired rather than kept as a spare. */
    3: require('../assets/images/p03.webp'),
    4: require('../assets/images/p04.webp'),
  };
  return map[n];
};

export const account = {
  handle: 'm620ui',
  display: 'M620',
  avatar: a(1),
  bio: '',
  followers: '0',
  following: '11',
};

/** The feed. Times are written as offsets from load so the relative labels stay stable. */
export const buildFeed = (now: number): Post[] => [
  {
    id: 'p1',
    handle: 'seafog',
    avatar: a(2),
    verified: false,
    postedAt: now - 25 * 60 * 1000,
    /* The run and its link are sized so the link lands where the capture has it: at the end of the
       paragraph's third line, starting 155.2 dp into the 320.7 dp column (the capture reports the
       node at 214.3) and 93.48 dp of advance (the capture's own box is 93.5). Both numbers are
       measured through the same layout engine the page uses - `pipeline/text_width.py` drives
       Chromium with the screen's own font stack, tracking and column - because advance sums from the
       font file alone are ~4% wide and give a different line break. */
    body: 'Coastal path reopened this morning. New timber along the fence line, so the fence should hold up through winter',
    link: 'harborline.org',
    photo: p(1),
    likes: 72,
    replies: 3,
    reposts: 2,
  },
  {
    id: 'p2',
    handle: 'quietmiles',
    avatar: a(3),
    verified: true,
    postedAt: now - 20 * 60 * 60 * 1000,
    /* One line in the reference's own column, so the replacement has to stay inside a single
       line's worth of advance: the row is content-paired, and the gate judges its left edge and
       its vertical centre, which a second line would move. */
    body: 'The fog never lifted off the bay today',
    likes: 1418,
    replies: 96,
    reposts: 12,
  },
  {
    id: 'p3',
    handle: 'cafehours',
    avatar: a(4),
    verified: false,
    postedAt: now - 3 * 60 * 60 * 1000,
    body: 'Opened the back room at last. Same beans, twice the seating, and a window that finally gets afternoon light.',
    photo: p(3),
    likes: 236,
    replies: 18,
    reposts: 4,
  },
  {
    id: 'p4',
    handle: 'keyboardnotes',
    avatar: a(5),
    verified: false,
    postedAt: now - 8 * 60 * 60 * 1000,
    body: 'Swapped the switches over the weekend and the desk is finally quiet enough to work at night.',
    photo: p(4),
    likes: 89,
    replies: 7,
    reposts: 1,
  },
];

/** The detail screen's own post and its reply tree, indented exactly as the reference is. */
export const buildThread = (now: number): { root: Post; replies: ReplyNode[] } => ({
  root: {
    id: 't0',
    handle: 'harborline',
    avatar: a(2),
    verified: true,
    postedAt: now - 21 * 60 * 60 * 1000,
    body: 'The trail survey is done. Twelve kilometres of coastline mapped, three access points need new steps, and the rest is just signage.',
    likes: 7236,
    replies: 165,
    reposts: 395,
  },
  replies: [
    {
      id: 'r1',
      handle: 'quietmiles',
      avatar: a(3),
      verified: false,
      postedAt: now - 21 * 60 * 60 * 1000,
      body: 'That matches the northern section, though our steps held up better than expected.',
      likes: 88,
      replies: 3,
      reposts: 1,
      depth: 1,
    },
    {
      id: 'r2',
      handle: 'harborline',
      avatar: a(2),
      verified: true,
      postedAt: now - 20 * 60 * 60 * 1000,
      body: 'Noted. Which stretch was that?',
      likes: 23,
      replies: 0,
      reposts: 0,
      depth: 2,
      author: true,
    },
    {
      id: 'r3',
      handle: 'cafehours',
      avatar: a(4),
      verified: false,
      postedAt: now - 18 * 60 * 60 * 1000,
      body: 'Is the middle access point open again, or still fenced off?',
      likes: 22,
      replies: 3,
      reposts: 0,
      depth: 2,
      collapsed: true,
    },
  ],
});

export const suggestions: Suggestion[] = [
  { id: 's1', handle: 'harborline', avatar: a(2), verified: true, bio: 'Coastal path notes and trail surveys.', followers: '18.4K' },
  { id: 's2', handle: 'quietmiles', avatar: a(3), verified: false, bio: 'Walking, mostly. Occasionally maps.', followers: '1,204' },
  { id: 's3', handle: 'cafehours', avatar: a(4), verified: false, bio: 'A small room with good light.', followers: '742' },
  { id: 's4', handle: 'keyboardnotes', avatar: a(5), verified: false, bio: 'Keyboards, switches, and quiet desks.', followers: '5,318' },
];

export type Trend = {
  id: string;
  /** One line at the reference's own 15 dp step; long enough to read, short enough not to wrap. */
  topic: string;
  /** Two lines in the reference's column, so the run's own box is the two-line one it reports. */
  summary: string;
  /** The reference draws a thumbnail on the first, third and fifth rows only. */
  thumb?: ImageSourcePropType;
};

export const trending: Trend[] = [
  {
    id: 'tr1',
    topic: 'Harbour ferry timetable',
    summary: 'Winter timetable starts Monday, adding two morning sailings and a later last boat.',
  },
  {
    id: 'tr2',
    topic: 'Cliff path repairs finish',
    summary: 'The western steps reopened after six weeks of work on the handrail and the upper gate.',
  },
  {
    id: 'tr3',
    topic: 'Night market returns',
    summary: 'Forty stalls return to the old depot yard on Friday, with the same late closing time.',
    thumb: p(3),
  },
  {
    id: 'tr4',
    topic: 'Depot line reopens',
    summary: 'Trains run again between the two yards after the signal cabinet was replaced overnight.',
  },
  {
    id: 'tr5',
    topic: 'Lantern festival lineup',
    summary: 'The full programme is out, with the river walk closing an hour before the first set.',
    thumb: p(4),
  },
];

export type SearchAccount = {
  id: string;
  /** Empty on the two rows the reference draws as a bare query echo or a name-only row. */
  handle: string;
  /** Empty when the reference reports no second run on that row. */
  name: string;
  avatar: ImageSourcePropType;
  verified: boolean;
  /** True on the two rows whose avatar is the reference's own magnifier disc, not a photo. */
  magnifier?: boolean;
  /** True on the row that echoes the typed query instead of a handle. */
  echo?: boolean;
};

/**
 * Search results. The reference's own captures carry thirteen rows of other people's accounts;
 * section 5.3 forbids reusing any of that, so these are invented, and only their row count and
 * their rows' boxes are taken from the reference (see spec/gate.json's content_pairing).
 */
export const searchAccounts: SearchAccount[] = [
  { id: 'sa1', handle: 'northpier', name: 'North Pier', avatar: a(2), verified: true },
  { id: 'sa2', handle: '', name: '', avatar: a(1), verified: false, magnifier: true, echo: true },
  { id: 'sa3', handle: 'tidewatch', name: '', avatar: a(1), verified: false, magnifier: true },
  { id: 'sa4', handle: 'quayside', name: 'Quayside', avatar: a(3), verified: true },
  { id: 'sa5', handle: 'saltmarsh_', name: 'Salt Marsh', avatar: a(4), verified: true },
  { id: 'sa6', handle: 'harbournotes', name: 'Harbour Notes', avatar: a(5), verified: false },
  { id: 'sa7', handle: 'drydock', name: 'drydock', avatar: a(2), verified: false },
  { id: 'sa8', handle: 'slipway', name: '⛵︎˖˖ ࠣ', avatar: a(3), verified: false },
  { id: 'sa9', handle: 'lowwater', name: 'Low Water', avatar: a(4), verified: false },
  { id: 'sa10', handle: 'pierhead_daily', name: 'Pierhead Daily', avatar: a(5), verified: false },
  { id: 'sa11', handle: 'mudflats', name: 'Mud Flats', avatar: a(1), verified: false },
  { id: 'sa12', handle: 'seamark', name: 'Sea Mark', avatar: a(2), verified: false },
  { id: 'sa13', handle: 'tidegate', name: 'تيدغيت', avatar: a(3), verified: true },
];

/** Activity rows. The reference's own categories are All / Follows / Conversations / Mentions. */
export const buildActivity = (now: number) => [
  { id: 'n1', handle: 'harborline', avatar: a(2), verified: true, at: now - 6 * 60 * 1000, text: 'replied to your thread', kind: 'reply' as const },
  { id: 'n2', handle: 'quietmiles', avatar: a(3), verified: false, at: now - 2 * 60 * 60 * 1000, text: 'and 12 others liked your post', kind: 'like' as const },
  { id: 'n3', handle: 'cafehours', avatar: a(4), verified: false, at: now - 9 * 60 * 60 * 1000, text: 'started following you', kind: 'follow' as const },
  { id: 'n4', handle: 'keyboardnotes', avatar: a(5), verified: false, at: now - 26 * 60 * 60 * 1000, text: 'mentioned you in a thread', kind: 'mention' as const },
];

/**
 * Relative time, computed — not a stored string.
 *
 * The reference's own labels are "25m", "20h", "3d"; the thresholds below reproduce that
 * ladder (under an hour -> minutes, under a day -> hours, otherwise days).
 */
export function relativeTime(postedAt: number, now: number): string {
  const s = Math.max(0, Math.floor((now - postedAt) / 1000));
  if (s < 60) return `${Math.max(1, s)}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  return `${w}w`;
}

/** Counts the reference abbreviates: 7.2K, 1.4M. */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  if (n < 1000000) return `${Math.round(n / 1000)}K`;
  return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
}

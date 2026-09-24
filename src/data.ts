import type { ImageSourcePropType } from 'react-native';
export type Post = {
    id: string;
    handle: string;
    avatar: ImageSourcePropType;
    verified: boolean;
    postedAt: number;
    body: string;
    link?: string;
    photo?: ImageSourcePropType;
    likes: number;
    replies: number;
    reposts: number;
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
    depth: number;
    author?: boolean;
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
    const map: Record<number, ImageSourcePropType> = {
        1: require('../assets/images/p01.webp'),
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
export const buildFeed = (now: number): Post[] => [
    {
        id: 'p1',
        handle: 'seafog',
        avatar: a(2),
        verified: false,
        postedAt: now - 25 * 60 * 1000,
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
export const buildThread = (now: number): {
    root: Post;
    replies: ReplyNode[];
} => ({
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
    topic: string;
    summary: string;
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
    handle: string;
    name: string;
    avatar: ImageSourcePropType;
    verified: boolean;
    magnifier?: boolean;
    echo?: boolean;
};
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
export const buildActivity = (now: number) => [
    { id: 'n1', handle: 'harborline', avatar: a(2), verified: true, at: now - 6 * 60 * 1000, text: 'replied to your thread', kind: 'reply' as const },
    { id: 'n2', handle: 'quietmiles', avatar: a(3), verified: false, at: now - 2 * 60 * 60 * 1000, text: 'and 12 others liked your post', kind: 'like' as const },
    { id: 'n3', handle: 'cafehours', avatar: a(4), verified: false, at: now - 9 * 60 * 60 * 1000, text: 'started following you', kind: 'follow' as const },
    { id: 'n4', handle: 'keyboardnotes', avatar: a(5), verified: false, at: now - 26 * 60 * 60 * 1000, text: 'mentioned you in a thread', kind: 'mention' as const },
];
export function relativeTime(postedAt: number, now: number): string {
    const s = Math.max(0, Math.floor((now - postedAt) / 1000));
    if (s < 60)
        return `${Math.max(1, s)}s`;
    const m = Math.floor(s / 60);
    if (m < 60)
        return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24)
        return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7)
        return `${d}d`;
    const w = Math.floor(d / 7);
    return `${w}w`;
}
export function formatCount(n: number): string {
    if (n < 1000)
        return String(n);
    if (n < 10000)
        return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    if (n < 1000000)
        return `${Math.round(n / 1000)}K`;
    return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
}

import * as React from 'react';
import Svg, { Circle, G, Path, Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../tokens';
export type IconProps = {
    size?: number;
    color?: string;
    fill?: string;
    filled?: boolean;
    strokeWidth?: number;
};
const base = (size: number, color: string, sw: number) => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24' as const,
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
});
export const MenuIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Line x1="3.5" y1="7" x2="20.5" y2="7"/>
    <Line x1="3.5" y1="12" x2="20.5" y2="12"/>
    <Line x1="3.5" y1="17" x2="20.5" y2="17"/>
  </Svg>);
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2.1 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Circle cx="10.8" cy="10.8" r="6.6"/>
    <Line x1="15.7" y1="15.7" x2="20.4" y2="20.4"/>
  </Svg>);
export const BellIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="M6.4 16.4v-5.1a5.6 5.6 0 0 1 11.2 0v5.1l1.4 1.6H5z"/>
    <Path d="M10.4 20.1a1.9 1.9 0 0 0 3.2 0"/>
  </Svg>);
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, filled = false, strokeWidth = 2 }) => (<Svg {...base(size, color, filled ? 0 : strokeWidth)}>
    <Path d="M3.6 9.9 12 3.4l8.4 6.5v9.2a1.5 1.5 0 0 1-1.5 1.5H5.1a1.5 1.5 0 0 1-1.5-1.5z" fill={filled ? color : 'none'} stroke={filled ? 'none' : color}/>
  </Svg>);
export const MessagesIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, filled = false, strokeWidth = 2 }) => (<Svg {...base(size, color, filled ? 0 : strokeWidth)}>
    <Path d="M21.4 3.4 2.9 10.1a.6.6 0 0 0 .1 1.1l6.7 2.1 2.1 6.7a.6.6 0 0 0 1.1.1z" fill={filled ? color : 'none'} stroke={filled ? 'none' : color}/>
  </Svg>);
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2.2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Line x1="12" y1="5.6" x2="12" y2="18.4"/>
    <Line x1="5.6" y1="12" x2="18.4" y2="12"/>
  </Svg>);
export const ActivityIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, filled = false, strokeWidth = 2 }) => (<Svg {...base(size, color, filled ? 0 : strokeWidth)}>
    <Path d="M12 20.4s-8.2-4.9-8.2-10.2a4.6 4.6 0 0 1 8.2-2.9 4.6 4.6 0 0 1 8.2 2.9c0 5.3-8.2 10.2-8.2 10.2z" fill={filled ? color : 'none'} stroke={filled ? 'none' : color}/>
  </Svg>);
export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, filled = false, strokeWidth = 2 }) => (<Svg {...base(size, color, filled ? 0 : strokeWidth)}>
    <Circle cx="12" cy="8" r="4.1" fill={filled ? color : 'none'} stroke={filled ? 'none' : color}/>
    <Path d="M4.6 20.6a7.6 7.6 0 0 1 14.8 0" fill="none" stroke={filled ? 'none' : color} opacity={filled ? 0 : 1}/>
    {filled ? <Path d="M4.6 20.6a7.6 7.6 0 0 1 14.8 0z" fill={color}/> : null}
  </Svg>);
export const HeartIcon: React.FC<IconProps> = ({ size = 20, color = colors.ink, filled = false, strokeWidth = 1.9 }) => (<Svg {...base(size, color, filled ? 0 : strokeWidth)}>
    <Path d="M12 20s-8-4.7-8-9.9a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.2-8 9.9-8 9.9z" fill={filled ? color : 'none'} stroke={filled ? 'none' : color}/>
  </Svg>);
export const ReplyIcon: React.FC<IconProps> = ({ size = 20, color = colors.ink, strokeWidth = 1.9 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="M20.2 11.4a7.3 7.3 0 0 1-7.3 7.3H7.9L3.8 21.5V11.4a7.3 7.3 0 0 1 7.3-7.3h1.8a7.3 7.3 0 0 1 7.3 7.3z"/>
  </Svg>);
export const RepostIcon: React.FC<IconProps> = ({ size = 20, color = colors.ink, strokeWidth = 1.9 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="M4.6 9.2V7.4a2.6 2.6 0 0 1 2.6-2.6h9.2"/>
    <Path d="M13.9 2.6 16.7 4.8 13.9 7"/>
    <Path d="M19.4 14.8v1.8a2.6 2.6 0 0 1-2.6 2.6H7.6"/>
    <Path d="M10.1 21.4 7.3 19.2 10.1 17"/>
  </Svg>);
export const ShareIcon: React.FC<IconProps> = ({ size = 20, color = colors.ink, strokeWidth = 1.9 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="M21 3.6 3.4 10.2a.5.5 0 0 0 .1.9l6.6 2.1 2.1 6.6a.5.5 0 0 0 .9.1z"/>
  </Svg>);
export const VerifiedIcon: React.FC<IconProps> = ({ size = 16, color = colors.verified }) => (<Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 1.9 14.6 4l3.2-.4 1 3.1 2.8 1.6-1 3.1 1 3.1-2.8 1.6-1 3.1-3.2-.4L12 22.1 9.4 20l-3.2.4-1-3.1-2.8-1.6 1-3.1-1-3.1 2.8-1.6 1-3.1L9.4 4z" fill={color}/>
    <Path d="m8.2 12.4 2.6 2.6 5-5.2" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>);
export const GlobeIcon: React.FC<IconProps> = ({ size = 16, color = colors.secondary, strokeWidth = 1.6 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="8.6"/>
    <Path d="M3.4 12h17.2"/>
    <Path d="M12 3.4c2.3 2.4 3.5 5.4 3.5 8.6S14.3 18.2 12 20.6C9.7 18.2 8.5 15.2 8.5 12S9.7 5.8 12 3.4z"/>
  </Svg>);
export const MoreIcon: React.FC<IconProps & {
    dotRadius?: number;
}> = ({ size = 16, color = colors.ink, dotRadius = 1.7, }) => (<Svg width={size} height={size} viewBox="0 0 24 24">
    
    <Circle cx="4" cy="12" r={dotRadius} fill={color}/>
    <Circle cx="12" cy="12" r={dotRadius} fill={color}/>
    <Circle cx="20" cy="12" r={dotRadius} fill={color}/>
  </Svg>);
export const BackIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2.3 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="M20 12H4.6"/>
    <Path d="M11 5.4 4 12l7 6.6"/>
  </Svg>);
export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = colors.ink, strokeWidth = 2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Line x1="5.4" y1="5.4" x2="18.6" y2="18.6"/>
    <Line x1="18.6" y1="5.4" x2="5.4" y2="18.6"/>
  </Svg>);
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, color = colors.secondary, strokeWidth = 2.2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="m9 5.4 6.6 6.6L9 18.6"/>
  </Svg>);
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, color = colors.ink, strokeWidth = 2.2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="m5.4 9 6.6 6.6L18.6 9"/>
  </Svg>);
export const ImageIcon: React.FC<IconProps> = ({ size = 22, color = colors.ink, strokeWidth = 1.9 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3"/>
    <Circle cx="8.6" cy="9.6" r="1.5"/>
    <Path d="m4.2 17.4 5-4.6 4.2 3.8 2.6-2.3 3.8 3.4"/>
  </Svg>);
export const GifIcon: React.FC<IconProps> = ({ size = 22, color = colors.ink, strokeWidth = 1.9 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Rect x="3.4" y="5.4" width="17.2" height="13.2" rx="3"/>
    <Path d="M10.6 10.4H8.2v3.2h1.6v-1.4"/>
    <Line x1="12.8" y1="10.4" x2="12.8" y2="13.6"/>
    <Path d="M15.4 13.6v-3.2h2.4M15.4 12h1.8"/>
  </Svg>);
export const ExpandIcon: React.FC<IconProps> = ({ size = 22, color = colors.ink, strokeWidth = 1.9 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Path d="M9.4 3.8H4v5.4"/>
    <Path d="M14.6 20.2H20v-5.4"/>
    <Line x1="4.6" y1="4.4" x2="10.4" y2="10.2"/>
    <Line x1="19.4" y1="19.6" x2="13.6" y2="13.8"/>
  </Svg>);
export const WordmarkGlyph: React.FC<{
    size?: number;
    color?: string;
}> = ({ size = 22, color = colors.ink }) => (<Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 21.4c-5 0-8.4-3.5-8.4-9.4S7 2.6 12 2.6c4.6 0 7.7 2.7 8.2 7.1" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M12.4 6.6c-3.4 0-5.5 1.9-5.5 5.2 0 3 2 4.9 5 4.9 3.4 0 5.4-2.1 5.4-5.6 0-3-1.9-4.9-5-4.9-2 0-3.6.7-4.6 1.9" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round"/>
  </Svg>);
export const WordmarkLockup: React.FC<{
    width?: number;
    height?: number;
    color?: string;
}> = ({ width = 119, height = 22.9, color = colors.ink, }) => (<Svg width={width} height={height} viewBox="0 0 119 22.9" fill="none">
    <G transform="translate(0 0) scale(0.9542)">
      <Path d="M12 21.4c-5 0-8.4-3.5-8.4-9.4S7 2.6 12 2.6c4.6 0 7.7 2.7 8.2 7.1" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M12.4 6.6c-3.4 0-5.5 1.9-5.5 5.2 0 3 2 4.9 5 4.9 3.4 0 5.4-2.1 5.4-5.6 0-3-1.9-4.9-5-4.9-2 0-3.6.7-4.6 1.9" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round"/>
    </G>
    <Path transform="translate(29 -0.1)" d="M7.27 18.24Q5.03 18.24 3.99 17.2Q2.95 16.16 2.95 14.13V2.27L5.54 1.3V14.16Q5.54 15.16 6.07 15.64Q6.59 16.11 7.76 16.11Q8.22 16.11 8.57 16.04Q8.92 15.98 9.18 15.88V17.97Q8.91 18.09 8.4 18.17Q7.9 18.24 7.27 18.24ZM0.4 7.3V5.21H9.18V7.3Z M11.67 18V-0.05H14.26V18ZM20.73 18V9.78Q20.73 8.46 20.07 7.8Q19.4 7.14 18.11 7.14Q16.98 7.14 16.11 7.64Q15.23 8.14 14.75 9.02Q14.26 9.91 14.26 11.1L13.93 8.05Q14.57 6.63 15.87 5.8Q17.17 4.96 18.9 4.96Q20.95 4.96 22.14 6.12Q23.32 7.28 23.32 9.18V18Z M26.86 18V5.21H29.34V8.39H29.45V18ZM29.45 11.33 29.12 8.3Q29.57 6.67 30.69 5.82Q31.8 4.96 33.31 4.96Q33.89 4.96 34.11 5.06V7.52Q33.99 7.47 33.76 7.46Q33.54 7.45 33.21 7.45Q31.34 7.45 30.39 8.42Q29.45 9.39 29.45 11.33Z M41.96 18.25Q40.03 18.25 38.57 17.39Q37.1 16.54 36.28 15.03Q35.46 13.53 35.46 11.57Q35.46 9.61 36.27 8.12Q37.09 6.63 38.56 5.8Q40.03 4.96 41.95 4.96Q43.8 4.96 45.16 5.75Q46.52 6.53 47.27 7.95Q48.01 9.36 48.01 11.27Q48.01 11.57 47.99 11.84Q47.98 12.1 47.93 12.38H37.2V10.44H46.1L45.44 11.21Q45.44 9.15 44.52 8.08Q43.6 7 41.93 7Q40.17 7 39.12 8.21Q38.07 9.43 38.07 11.58Q38.07 13.75 39.12 14.98Q40.17 16.21 42.02 16.21Q43.14 16.21 43.97 15.75Q44.81 15.29 45.2 14.4H47.65Q47.02 16.19 45.54 17.22Q44.06 18.25 41.96 18.25Z M58.59 18Q58.47 17.53 58.43 16.96Q58.38 16.38 58.38 15.53H58.26V9.44Q58.26 8.21 57.65 7.61Q57.03 7 55.71 7Q54.43 7 53.66 7.5Q52.9 8.01 52.77 8.93H50.29Q50.46 7.12 51.92 6.04Q53.38 4.96 55.81 4.96Q58.31 4.96 59.57 6.13Q60.82 7.29 60.82 9.56V15.53Q60.82 16.11 60.9 16.72Q60.98 17.32 61.13 18ZM54.18 18.25Q52.22 18.25 51.07 17.29Q49.91 16.32 49.91 14.67Q49.91 12.95 51.13 11.97Q52.35 10.99 54.62 10.63L58.84 9.95V11.78L55.03 12.38Q53.76 12.58 53.11 13.06Q52.47 13.55 52.47 14.45Q52.47 15.31 53.06 15.75Q53.66 16.19 54.78 16.19Q56.29 16.19 57.28 15.47Q58.26 14.75 58.26 13.65L58.6 15.5Q58.15 16.83 56.99 17.54Q55.84 18.25 54.18 18.25Z M73.58 18V15.07L73.83 15.13Q73.43 16.56 72.17 17.41Q70.91 18.25 69.17 18.25Q67.43 18.25 66.14 17.43Q64.85 16.6 64.14 15.13Q63.43 13.65 63.43 11.66Q63.43 9.64 64.15 8.14Q64.88 6.63 66.19 5.81Q67.5 4.98 69.25 4.98Q71.07 4.98 72.26 5.85Q73.46 6.72 73.83 8.28L73.47 8.32V-0.05H76.06V18ZM69.82 16.08Q71.55 16.08 72.55 14.89Q73.56 13.7 73.56 11.59Q73.56 9.52 72.54 8.34Q71.52 7.15 69.8 7.15Q68.1 7.15 67.1 8.34Q66.1 9.53 66.1 11.65Q66.1 13.74 67.1 14.91Q68.1 16.08 69.82 16.08Z M84.34 18.25Q81.84 18.25 80.35 17.15Q78.86 16.04 78.68 14.05H81.08Q81.24 15.15 82.09 15.73Q82.94 16.31 84.38 16.31Q85.66 16.31 86.34 15.86Q87.02 15.42 87.02 14.59Q87.02 14 86.63 13.58Q86.24 13.17 85.11 12.89L83.06 12.4Q81.13 11.94 80.18 10.99Q79.24 10.04 79.24 8.67Q79.24 6.94 80.53 5.95Q81.83 4.96 84.08 4.96Q86.32 4.96 87.69 5.97Q89.06 6.98 89.22 8.77H86.82Q86.67 7.86 85.95 7.38Q85.23 6.9 84.01 6.9Q82.86 6.9 82.24 7.31Q81.63 7.71 81.63 8.46Q81.63 9.04 82.09 9.45Q82.55 9.85 83.63 10.14L85.73 10.66Q87.56 11.11 88.49 12.13Q89.42 13.14 89.42 14.56Q89.42 16.3 88.08 17.28Q86.74 18.25 84.34 18.25Z" fill={color}/>
  </Svg>);
export const WordmarkPlate: React.FC<{
    width?: number;
    height?: number;
    color?: string;
}> = ({ width = 120, height = 23, color = colors.ink, }) => (<Svg width={width} height={height} viewBox="0 0 120 23">
    <Circle cx="11.5" cy="11.5" r="9.6" fill="none" stroke={color} strokeWidth="2.4"/>
    <Path d="M12 4.4c-3.9 0-6.3 2.2-6.3 6 0 3.4 2.3 5.6 5.7 5.6 3.9 0 6.2-2.4 6.2-6.4 0-3.4-2.2-5.6-5.7-5.6-2.3 0-4.1.8-5.3 2.2" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round"/>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (<Rect key={i} x={27 + i * 13.2} y={i % 2 ? 6.4 : 7.6} width={2.4} height={i % 2 ? 10 : 8.8} fill={color} rx={1.1}/>))}
  </Svg>);
export const InstagramMark: React.FC<{
    size?: number;
    color?: string;
}> = ({ size = 24, color = colors.igBlue }) => (<Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" fill="none" stroke={color} strokeWidth="1.9"/>
    <Circle cx="12" cy="12" r="4.4" fill="none" stroke={color} strokeWidth="1.9"/>
    <Circle cx="17.4" cy="6.6" r="1.4" fill={color}/>
  </Svg>);
export const MetaLogo: React.FC<{
    width?: number;
    height?: number;
}> = ({ width = 60, height = 12 }) => (<Svg width={width} height={height} viewBox="0 0 60 12">
    <Path d="M6.4 10.2c-2 0-3.3-1.5-3.3-4.1S4.4 1.8 6.4 1.8c1.6 0 2.6.9 3.4 2.6l.9 2c.7 1.5 1.3 2.2 2.1 2.2 1.2 0 1.9-1.1 1.9-3.2 0-2.4-.9-3.6-2.7-3.6-1.1 0-2 .4-2.8 1.3" fill="none" stroke="#0868E0" strokeWidth="1.5" strokeLinecap="round"/>
    <Path d="M12.2 7.6c-.6 1.6-1.5 2.6-2.8 2.6-1.6 0-2.5-1.2-3.3-3.3L5.2 4.7" fill="none" stroke="#0868E0" strokeWidth="1.5" strokeLinecap="round"/>
    <SvgText x="19" y="9.4" fontSize="10" fontFamily="ThreadsBody" fontWeight="700" fill="#1C2B33">
      Meta
    </SvgText>
  </Svg>);
export const FiltersIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 1.8 }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="3" y1="7" x2="21" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="3" y1="17" x2="21" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Circle cx="15.5" cy="7" r="2.1" fill={colors.page} stroke={color} strokeWidth={strokeWidth}/>
    <Circle cx="8.5" cy="12" r="2.1" fill={colors.page} stroke={color} strokeWidth={strokeWidth}/>
    <Circle cx="16.5" cy="17" r="2.1" fill={colors.page} stroke={color} strokeWidth={strokeWidth}/>
  </Svg>);
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Line x1="4" y1="8" x2="20" y2="8"/>
    <Line x1="4" y1="16" x2="20" y2="16"/>
    <Circle cx="9.4" cy="8" r="2.3" fill={colors.surface}/>
    <Circle cx="14.6" cy="16" r="2.3" fill={colors.surface}/>
  </Svg>);
export const InsightsIcon: React.FC<IconProps> = ({ size = 24, color = colors.ink, strokeWidth = 2 }) => (<Svg {...base(size, color, strokeWidth)}>
    <Line x1="6.4" y1="19" x2="6.4" y2="12.5"/>
    <Line x1="12" y1="19" x2="12" y2="5.6"/>
    <Line x1="17.6" y1="19" x2="17.6" y2="9.4"/>
  </Svg>);

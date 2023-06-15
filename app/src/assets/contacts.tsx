import { ReactNode } from 'react';
import { BsGithub, BsTelephoneFill } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { HiMailOpen } from 'react-icons/hi';

type Contact = { icon: ReactNode; title: string; url: string };
export const contacts: Contact[] = [
  {
    icon: <BsTelephoneFill size={20} />,
    title: '89999872858',
    url: 'tel://89999872858',
  },
  {
    icon: <FaTelegramPlane size={24} />,
    title: '@Winprox',
    url: 'https://t.me/winprox',
  },
  {
    icon: <BsGithub size={24} />,
    title: '@Winprox',
    url: 'https://github.com/winprox',
  },
  {
    icon: <HiMailOpen size={24} />,
    title: 'davydov0@outlook.com',
    url: 'mailto:davydov0@outlook.com',
  },
];

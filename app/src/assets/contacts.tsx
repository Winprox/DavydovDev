import { ReactNode } from 'react';
import { BsGithub, BsPersonFill, BsTelephoneFill } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { HiMailOpen } from 'react-icons/hi';

const hhLink = 'https://hh.ru/resume/267166b6ff04343b0e0039ed1f3836796b6379';

type Contact = { icon: ReactNode; title: string; url: string };
export const contacts: Contact[] = [
  {
    icon: <BsTelephoneFill size={20} />,
    title: '89999872858',
    url: 'tel://89999872858'
  },
  {
    icon: <FaTelegramPlane size={24} />,
    title: '@Winprox',
    url: 'https://t.me/winprox'
  },
  {
    icon: <BsGithub size={24} />,
    title: '@Winprox',
    url: 'https://github.com/winprox'
  },
  {
    icon: <HiMailOpen size={24} />,
    title: 'davydov0@outlook.com',
    url: 'mailto:davydov0@outlook.com'
  },
  {
    icon: <BsPersonFill size={24} />,
    title: 'HeadHunter',
    url: hhLink
  }
];

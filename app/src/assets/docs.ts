import CAE from './pictures/docs/cae.jpg';
import CV from './pictures/docs/cv.jpg';
import Diploma from './pictures/docs/diploma.jpg';
import Supplement from './pictures/docs/supplement.jpg';
import Thesis from './pictures/docs/thesis.jpg';

type Doc = { title: string; image: string; url: string };
export const docs: Doc[] = [
  {
    title: 'Резюме',
    image: CV,
    url: 'https://hh.ru/resume/267166b6ff04343b0e0039ed1f3836796b6379',
  },
  {
    title: 'Сертификат CAE',
    image: CAE,
    url: 'https://drive.google.com/file/d/1wjt9jSnN00HxkPbaL1egawvEj7g2TUOJ/view',
  },
  {
    title: 'Магистерская диссертация',
    image: Thesis,
    url: 'https://drive.google.com/file/d/1OZF11i-PlrSw5-4o6PJFKgDIEUlKPhWS/view',
  },
  {
    title: 'Диплом бакалавра',
    image: Diploma,
    url: 'https://drive.google.com/file/d/1wWKD3qlb-cd1yl2Zn-MtHltG8JpQ-vR-/view',
  },
  {
    title: 'Диплом магистра',
    image: Diploma,
    url: 'https://drive.google.com/file/d/1WuvpEF_9lOGIf7wlj5GXa6-VDW25y6mG/view',
  },
  {
    title: 'Европейское приложение к диплому',
    image: Supplement,
    url: 'https://drive.google.com/file/d/1ebT93uveDAn-xxe8stU8-3cNtaJuGUGU/view',
  },
];

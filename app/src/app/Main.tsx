import { Button, Card, Image, MarkDown, ProjectCard, ProjectModal, cm, openNewTab, } from '@local/components'; // prettier-ignore
import { FC, HTMLAttributes, UIEvent, useEffect, useRef, useState } from 'react';
import { BsTelephoneFill } from 'react-icons/bs';
import { IoIosArrowUp } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import '../app/app.css';
import { contacts } from '../assets/contacts';
import { docs } from '../assets/docs';
import AboutMd from '../assets/md/about.md';
import AboutTopMd from '../assets/md/aboutTop.md';
import Avatar from '../assets/pictures/avatar.jpg';
import { projects } from '../assets/projects';

export default () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [theme] = useState<'light' | 'dark'>('light'); //? Work in Progress
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const project = projects.find((p) => p.id === selectedProjectId);

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showContactsButton, setShowContactsButton] = useState(true);
  const [fabScrollUp, setFabScrollUp] = useState(false);
  const scrollHandler = ({ currentTarget }: UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } = currentTarget;
    setFabScrollUp(showContactsButton && scrollTop > (scrollHeight - clientHeight) / 2);
  };

  const [aboutTop, setAboutTop] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    fetch(AboutTopMd)
      .then((r) => r.text())
      .then((t) => setAboutTop(t));
    fetch(AboutMd)
      .then((r) => r.text())
      .then((t) => setAbout(t));
  }, []);

  //? Блокировать зум в iOS
  useEffect(() => {
    const lockZoom = (e: Event) => {
      e.preventDefault();
      // @ts-expect-error zoom is non standard prop
      document.body.style.zoom = 1;
    };
    document.addEventListener('gesturestart', (e) => lockZoom(e));
    document.addEventListener('gesturechange', (e) => lockZoom(e));
    document.addEventListener('gestureend', (e) => lockZoom(e));
  }, []);

  //? Показывать кнопку контакты если высота документа > 150% высоты окна
  useEffect(() => {
    const checkShowContactsButton = () =>
      setShowContactsButton(
        (scrollRef.current?.scrollHeight ?? 0) / 1.5 > (scrollRef.current?.clientHeight ?? 0)
      );
    checkShowContactsButton();
    window.addEventListener('resize', checkShowContactsButton);
    return () => window.removeEventListener('resize', checkShowContactsButton);
  }, [scrollRef]);

  //? Получить id проекта из ссылки
  useEffect(() => {
    setSelectedProjectId(pathname.length > 1 ? pathname.substring(1) : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //? Сменить ссылку и заголовок документа при выборе id проекта
  useEffect(() => {
    navigate(`${(project ? selectedProjectId : undefined) ?? '/'}`);
    document.title = `DavydovDev.com${project?.title ? ` | ${project.title}` : ''}`;
  }, [project, selectedProjectId, navigate]);

  return (
    <div ref={scrollRef} onScroll={scrollHandler} className='root'>
      {/*//? MODAL */}
      {project !== undefined && (
        <ProjectModal
          theme={theme}
          title={project.title}
          desc={project.desc}
          footer={project.footer}
          stack={project.stack}
          images={project.images}
          imageProps={project.imageProps}
          carouselProps={project.carouselProps}
          actions={project.actions}
          onClose={() => setSelectedProjectId(undefined)}
          modalProps={{ backdropProps: { className: 'z-50' } }}
        />
      )}
      {/*//? FAB */}
      <div className='absolute bottom-0 flex w-full justify-center'>
        <div className='flex w-full max-w-screen-xl justify-end'>
          <Button
            tabIndex={-1}
            key={String(fabScrollUp)}
            variant='circlePrimary'
            className='z-40 m-4 h-14 animate-aFadeInScale'
            onClick={() =>
              fabScrollUp
                ? contentRef.current?.scrollIntoView({ behavior: 'smooth' })
                : openNewTab(docs.at(0)?.url ?? '')
            }
          >
            {fabScrollUp && <IoIosArrowUp className='mb-1' size={34} />}
            {!fabScrollUp && (
              <a
                tabIndex={-1}
                href={docs.at(0)?.url}
                className='flex h-full w-full items-center justify-center'
                onClick={(e) => e.preventDefault()}
              >
                <p className='mt-1 font-teko text-3xl leading-[0]'>CV</p>
              </a>
            )}
          </Button>
        </div>
      </div>
      {/*//? CONTENT */}
      <div
        ref={contentRef}
        className={cm(
          'flex flex-col items-center pb-28 pt-12 transition-all',
          theme === 'dark' && 'bg-aTextBlack',
          theme !== 'dark' && 'bg-white'
        )}
      >
        <SectionWrapper className='max-w-screen-lg gap-10'>
          <div
            className={cm(
              'mb-8 h-[0.33rem] w-full rounded-2xl transition-all md:px-2 lg:px-8',
              'bg-gradient-to-br from-aPrimary to-aSecondary shadow-aCard'
            )}
          />
          <div className='flex w-full flex-col items-center gap-8 md:flex-row md:gap-10 md:px-4 lg:px-10'>
            <Image shadow theme={theme} variant='circle' className='h-48' src={Avatar} />
            <MarkDown theme={theme} className={'flex-1'}>
              {aboutTop}
            </MarkDown>
          </div>
          <MarkDown theme={theme}>{about}</MarkDown>
          {showContactsButton && (
            <Button
              tabIndex={project ? -1 : 1}
              className='flex animate-aFadeIn gap-2'
              onClick={() =>
                contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
              }
            >
              <BsTelephoneFill size={18} />
              Контакты
            </Button>
          )}
        </SectionWrapper>
        <SectionHeader theme={theme}>Кейсы</SectionHeader>
        <SectionWrapper className='gap-10'>
          {projects.map(({ id, title, cardImage: cardBanner, cardDesc, cardStack }, i) => (
            <Button
              key={id}
              href={id}
              variant='transparent'
              className='active:hover:scale-110'
              tabIndex={project ? -1 : 10 + i}
              onClick={() => setSelectedProjectId(id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProjectId(id)}
            >
              <ProjectCard
                theme={theme}
                image={cardBanner}
                title={title}
                desc={cardDesc}
                stack={cardStack}
              />
            </Button>
          ))}
        </SectionWrapper>
        <SectionHeader theme={theme}>Документы</SectionHeader>
        <SectionWrapper className='gap-6'>
          {docs.map(({ title, image, url }, i) => (
            <Button
              key={i}
              href={url}
              variant='transparent'
              className='active:hover:scale-110'
              tabIndex={project ? -1 : 100 + i}
              onClick={() => openNewTab(url)}
              onKeyDown={(e) => e.key === 'Enter' && openNewTab(url)}
            >
              <Card
                key={title}
                rotateFactor={3}
                theme='light'
                className='rounded-3xl border-2 border-aPrimary border-opacity-20 shadow-lg'
              >
                <Image
                  blurred
                  variant='rounded'
                  title={title}
                  className='aspect-a4 h-40'
                  src={image}
                />
              </Card>
            </Button>
          ))}
        </SectionWrapper>
        <SectionHeader theme={theme}>Контакты</SectionHeader>
        <div className='flex flex-wrap justify-center gap-6 gap-y-5 px-6'>
          {contacts.map(({ icon, title, url }, i) => (
            <Button
              key={i}
              href={url}
              theme={theme}
              tabIndex={project ? -1 : 1000 + i}
              variant='transparent'
              className='flex items-center gap-2 text-lg'
              onClick={() => openNewTab(url)}
              onKeyDown={(e) => e.key === 'Enter' && openNewTab(url)}
            >
              {icon}
              {title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SectionHeader: FC<HTMLAttributes<HTMLHeadingElement> & { theme?: 'light' | 'dark' }> = ({
  className,
  theme,
  ...p
}) => (
  <h2
    {...p}
    className={cm(
      'select-none pb-8 pt-20 text-2xl',
      theme === 'dark' && 'text-aTextWhite',
      theme !== 'dark' && 'text-aTextBlack',
      className
    )}
  ></h2>
);

const SectionWrapper: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div
    {...p}
    className={cm(
      'w-full max-w-screen-xl px-4 transition-all sm:px-10',
      'flex flex-wrap justify-center',
      className
    )}
  />
);

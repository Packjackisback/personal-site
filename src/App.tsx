import FallingText from '@/components/FallingText';
import TextType from '@/components/TextType';
import { useCallback, useEffect, useRef, useState } from 'react';

const BREAKPOINT = "min-width: 600px";

const SCREEN = [
  '',
  '',
  'JacksonM.dev',
  '',
  'A general protection fault has occurred in module WEBSITE.EXE at 0003:2F4A.',
  '',
  '* Press any key to terminate the current application.',
  '* Press CTRL+ALT+DEL again to restart your computer. You will',
  '  lose unsaved information in all applications.',
  '',
  ''
].join('\n');

const FALL_DELAY_SECONDS = 3;
const FALL_FADE_SECONDS = 1.2;
const CONTENT_ENTER_OFFSET_MS = 180;
const INTRO_SEEN_KEY = 'jacksonm.introSeen.v1';
const HOST_LABEL = __HOST_DEVICE_LABEL__ || 'unknown host';
const HOST_RAM_TOTAL_GB = __HOST_RAM_TOTAL_GB__ || '?';
const HOST_RAM_USED_GB = __HOST_RAM_USED_GB__ || '?';
const HOST_CPU_PERCENT = Number.isFinite(__HOST_CPU_PERCENT__) ? __HOST_CPU_PERCENT__ : 0;

export default function App() {
  const fallenRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const revealTimerRef = useRef<number | null>(null);
  const [run, setRun] = useState(0);
  const [showContent, setShowContent] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(INTRO_SEEN_KEY) === '1';
  });
  const [introIdle, setIntroIdle] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(INTRO_SEEN_KEY) !== '1';
  });

  useEffect(() => {
    if (showContent) fallenRef.current = true;
  }, [showContent]);

  const drop = useCallback(async () => {
    if (fallenRef.current) return;
    fallenRef.current = true;
    setIntroIdle(false);
    await document.fonts?.ready;
    const trigger = stageRef.current?.querySelector<HTMLElement>('[data-trigger]');
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
    }
    const revealDelayMs = Math.max(0, (FALL_DELAY_SECONDS + FALL_FADE_SECONDS) * 1000 - CONTENT_ENTER_OFFSET_MS);
    revealTimerRef.current = window.setTimeout(() => {
      setShowContent(true);
      window.localStorage.setItem(INTRO_SEEN_KEY, '1');
      revealTimerRef.current = null;
    }, revealDelayMs);
  }, []);

  const replayIntro = useCallback(() => {
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    fallenRef.current = false;
    setShowContent(false);
    setIntroIdle(true);
    setRun(value => value + 1);
  }, []);


  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      void drop();
    };
    const onScroll = () => void drop();
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, [drop]);

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#0000aa] font-vga text-[#aaaaaa]">
      <section
        className={`absolute inset-0 z-10 overflow-y-auto transition-all duration-900 ease-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={!showContent}
      >
        <div className="min-h-full px-4 py-8 text-[#d2d2d2] [&_a]:cursor-pointer [&_a]:text-[#d2d2d2] [&_h1]:text-[#d2d2d2] [&_h2]:text-[#d2d2d2] [&_p]:text-[#d2d2d2] sm:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <div className="w-full border-b border-[#d2d2d2] pb-3">
              <TextType
                as="h1"
                text={["Jackson MacGregor"]}
                typingSpeed={80}
                pauseDuration={1600}
                deletingSpeed={35}
                deleteMode="backspace"
                typeEffect="none"
                mistakes={0}
                cursorStyle="block"
                cursorGlide
                showCursor={false}
                cursorBlinkDuration={0.55}
                variableSpeed={{ min: 60, max: 130 }}
                loop={false}
                className="w-full text-8xl leading-none tracking-tight sm:text-9xl lg:text-10xl"
              />
            </div>

            <section className="mt-10 space-y-3">
              <h2 className="text-xl uppercase tracking-wide">About</h2>
              <p className="max-w-3xl leading-relaxed">
                I'm Jackson MacGregor, a systems engineer and software developer. I enjoy building systems to serve and improve the lives of people around me, and I have a particular interest in operating systems, messing about with neural networks, and experimenting with old technology.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                <a className="underline" href="https://github.com/packjackisback">GitHub</a>
                <a className="underline" href="https://www.linkedin.com/in/jackson-macgregor-344a222a4/">LinkedIn</a>
                <a className="underline" href="mailto:jackson.n.macgregor@gmail.com">Email</a>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-xl uppercase tracking-wide">Projects</h2>
              <ul className="mt-4 space-y-5">
                <li>
                  <a className="underline" href="https://github.com/Packjackisback/homeaccess-api">homeaccess-api</a>
                  <p className="mt-1 max-w-3xl leading-relaxed">An API for accessing grade information from the powerschool HAC system that includes caching and other optimisations.</p>
                </li>
                <li>
                  <a className="underline" href="https://github.com/Packjackisback/uil-bot">uil-bot</a>
                  <p className="mt-1 max-w-3xl leading-relaxed">A Discord bot linked to my UIL packet parser that can quiz users on digested packets.</p>
                </li>
                <li>
                  <a className="underline" href="https://github.com/Packjackisback/infinitex">infinitex</a>
                  <p className="mt-1 max-w-3xl leading-relaxed">An infinite whiteboard app with Latex importing capabilities.</p>
                </li>
                <li>
                  <a className="underline" href="https://github.com/Packjackisback/os">packOS</a>
                  <p className="mt-1 max-w-3xl leading-relaxed">My quick and dirty operating system made in C and Assembly.</p>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </section>

      {showContent && (
        <p className="pointer-events-none absolute right-4 bottom-2 left-4 z-20 text-xs text-[#d2d2d2]">
          Hosted on {HOST_LABEL} - {HOST_RAM_USED_GB}/{HOST_RAM_TOTAL_GB}GB RAM - {HOST_CPU_PERCENT}% CPU
        </p>
      )}

      {showContent && (
        <button
          type="button"
          onClick={replayIntro}
          className="absolute right-4 bottom-4 z-30 cursor-pointer border border-[#d2d2d2] bg-[#0000aa] px-3 py-2 text-sm leading-none text-[#d2d2d2] transition-colors hover:bg-[#ffffff] hover:text-[#0000aa]"
        >
          Replay Start
        </button>
      )}

      <div
        ref={stageRef}
        className={`absolute inset-0 z-20 h-full w-full transition-opacity duration-700 ease-out ${
          showContent ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        onClick={() => void drop()}
      >
        {introIdle && (
          <p className="pointer-events-none absolute right-0 bottom-10 left-0 z-30 text-center text-[clamp(18px,2.4vw,28px)] press-any-key-pulse">
            Press any key (or click/tap)
          </p>
        )}
        <FallingText
          key={run}
          text={SCREEN}
          trigger="click"
          highlightWords={['JacksonM.dev']}
          highlightClass="bg-[#aaaaaa] px-[1ch] font-normal!"
          accentColor="#0000aa"
          backgroundColor="#0000aa"
          fontSize="clamp(18px, 2.6vw, 34px)"
          className="items-start justify-center"
          textClassName="text-center"
          style={{ color: '#aaaaaa' }}
          gravity={1.1}
          bounciness={0.15}
          scatter={0.6}
          stagger={0.04}
          order="random"
          fadeOutDelay={FALL_DELAY_SECONDS}
          fadeOutDuration={FALL_FADE_SECONDS}
        />
      </div>
    </main>
  );
}

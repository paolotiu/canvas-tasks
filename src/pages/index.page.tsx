import Image from 'next/image';
import router from 'next/router';
import tw, { styled } from 'twin.macro';
import { FileTextIcon, SymbolIcon } from '@radix-ui/react-icons';
import GuideLines from '@/components/GuideLines';

const CopyTitle = styled('h2', {
  ...tw`relative px-2 mx-4 text-3xl font-medium 900:mx-12 `,
});

const FeatureTitle = styled('h4', {
  ...tw`relative pl-2 font-medium text-mauve12`,
  '&::before': {
    ...tw`w-[1px] h-[80%] bg-black absolute top-1/2 left-0 transform -translate-y-1/2`,
    content: '',
  },
});

const Sect: React.FC<{ className?: string }> = ({ className, children }) => {
  return (
    <section tw="flex justify-center" className={className}>
      <div tw="max-w-[1300px] flex-1">{children}</div>
    </section>
  );
};

export default function Home() {
  return (
    // TODO: Remove full page hack once more stuff can be added to the home page
    <main tw="bg-mauve2 min-h-screen max-h-screen overflow-hidden">
      <Sect>
        <GuideLines>
          <header tw="px-6 900:px-14 py-6 flex justify-between">
            <div tw="flex items-center gap-2">
              <Image src="/logos/icantvas.svg" width={28} height={28} alt="ICantvas Logo" />
              <span tw="font-bold text-xl">ICantvas</span>
            </div>
            <nav>
              <a href="/signin">Sign in</a>
            </nav>
          </header>
        </GuideLines>
      </Sect>

      <Sect tw="border-b">
        <GuideLines>
          <div tw="px-6 900:px-14 pt-32 pb-12 grid gap-8">
            <h1 tw="text-5xl  md:text-6xl max-w-xl font-bold text-mauve12">
              Because we know you really cant
            </h1>
            <p tw="text-mauve11 font-medium">Stop it, get some help</p>
            <div tw="">
              <button
                type="button"
                tw="bg-gray-800 px-3 py-2 text-gray-100 rounded-sm border border-gray-800 font-medium hover:bg-gray-900 transition-colors"
                onClick={async () => {
                  router.push('/signin');
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </GuideLines>
      </Sect>
      <Sect tw="bg-mauve1">
        <GuideLines>
          <section tw="grid pt-12 pb-80">
            <div>
              <CopyTitle>Features</CopyTitle>
              <p tw="px-6 900:px-14 text-sm text-mauve11 font-medium">
                No, but really, what do we do?
              </p>
            </div>

            <div tw="pt-8 grid grid-cols-1 sm:grid-cols-2 900:grid-cols-4! px-4 900:px-12 gap-y-12">
              <div tw="grid gap-2">
                <SymbolIcon tw="w-8 h-8 mx-2 fill-current text-mauve12" />
                <FeatureTitle tw="font-medium text-mauve12 flex gap-2 items-center">
                  Synced Google Tasks
                </FeatureTitle>
                <p tw="pl-2 pr-8 text-15">
                  Spend exactly <strong>0 seconds*</strong> listing down your assingments,
                  deadlines, and tasks.
                </p>
                <small tw="pl-2 text-xs text-mauve10">*A little bit more than 0 seconds</small>
              </div>
              <div tw="grid gap-2">
                <FileTextIcon tw="w-8 h-8 mx-2 fill-current text-mauve12" />
                <FeatureTitle tw="font-medium text-mauve12 flex gap-2 items-center">
                  Save as PDF
                </FeatureTitle>
                <p tw="pl-2 pr-8 text-15">Save your modules as a PDF, and</p>
                <small tw="pl-2 text-xs text-mauve10">*A little bit more than 0 seconds</small>
              </div>
            </div>
          </section>
        </GuideLines>
      </Sect>
    </main>
  );
}

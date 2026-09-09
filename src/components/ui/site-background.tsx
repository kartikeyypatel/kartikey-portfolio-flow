import { BackgroundPaths } from './background-paths';

// Shared ambient backdrop rendered once behind the whole page (fixed, so it
// never scrolls away) so every section reads as one continuous canvas
// instead of each having its own disconnected background treatment.
const SiteBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#070a0a] pointer-events-none" aria-hidden="true">
    <BackgroundPaths />
    <div className="absolute -top-32 left-[10%] hidden h-[500px] w-[500px] rounded-full bg-portfolio-cyan/[0.045] blur-[170px] md:block" />
    <div className="absolute bottom-[-10%] right-[8%] hidden h-[520px] w-[520px] rounded-full bg-portfolio-cyan/[0.025] blur-[180px] md:block" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_48%_at_50%_45%,transparent_0%,rgba(7,10,10,0.18)_58%,rgba(7,10,10,0.62)_100%)]" />
  </div>
);

export default SiteBackground;

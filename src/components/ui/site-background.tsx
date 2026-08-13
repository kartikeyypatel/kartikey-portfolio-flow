// Shared ambient backdrop rendered once behind the whole page (fixed, so it
// never scrolls away) so every section reads as one continuous canvas
// instead of each having its own disconnected background treatment.
const SiteBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-portfolio-black pointer-events-none">
    <div className="absolute -top-32 left-[10%] w-[500px] h-[500px] bg-portfolio-cyan/10 rounded-full blur-[150px]" />
    <div className="absolute top-[40%] -right-40 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[150px]" />
    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-portfolio-cyan/5 rounded-full blur-[150px]" />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #22D3EE 1px, transparent 1px), linear-gradient(to bottom, #22D3EE 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    />
  </div>
);

export default SiteBackground;

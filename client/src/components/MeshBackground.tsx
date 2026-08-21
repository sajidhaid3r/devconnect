export default function MeshBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-dark-base"
    >
      {/* Animated Gradient Mesh Blobs */}
      <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-transparent blur-[110px] animate-mesh-drift-1" />
      
      <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-magenta-500/25 via-pink-600/15 to-transparent blur-[120px] animate-mesh-drift-2" />
      
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-brand-indigo/25 via-violet-700/20 to-amber-500/10 blur-[130px] animate-mesh-drift-3" />
      
      <div className="absolute top-[60%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-violet-900/20 to-magenta-900/10 blur-[100px]" />

      {/* Faint Grain/Noise Texture Overlay (~5% opacity) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.045] mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

import type { Media } from "@/types/project";

export default function AudioPlayer({ media }: { media: Media }) {
  return (
    <section className="audio-player">
      <div className="audio-topline"><span>Audio preview</span><span>SY / SOUND 01</span></div>
      <h3>{media.caption}</h3>
      {media.url ? <audio controls preload="none"><source src={media.url} /></audio> : <div className="audio-placeholder"><span>Connect a NAS preview URL to enable playback.</span><div className="waveform" aria-hidden>{Array.from({ length: 28 }, (_, i) => <i key={i} />)}</div></div>}
    </section>
  );
}

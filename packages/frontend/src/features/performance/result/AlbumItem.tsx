import type { PerformanceAndComposer } from "@classic-hub/shared/types/performance";

const AlbumItem = ({
  posterUrl,
  title,
  artist,
  time,
  stdate,
  eddate,
  hall,
  composerArray
}: PerformanceAndComposer) => {
  return (
    <div className="">
      <div className="w-56 aspect-10/14 overflow-hidden">
        <img className="w-full h-full" src={posterUrl} alt=""/>
      </div>
      
    </div>
  );
};

export default AlbumItem;

import { getYoutubeEmbedUrl } from '@/data/mockData';

interface VideoPlayerProps {
  youtubeUrl: string;
  title: string;
}

const VideoPlayer = ({ youtubeUrl, title }: VideoPlayerProps) => {
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

  return (
    <div className="overflow-hidden rounded-xl bg-foreground/5">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoPlayer;

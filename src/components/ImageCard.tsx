import type { Image } from '../types'

interface ImageCardProps {
  image: Image
  onHashtagClick: (hashtag: string) => void
}

export default function ImageCard({ image, onHashtagClick }: ImageCardProps) {
  return (
    <div className="mb-4 break-inside-avoid rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
      <img
        src={image.url}
        alt={image.title}
        loading="lazy"
        className="w-full object-cover"
        style={{ aspectRatio: `${image.width}/${image.height}` }}
      />
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">{image.title}</h3>
        <div className="flex flex-wrap gap-1">
          {image.hashtags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onHashtagClick(tag.name)}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

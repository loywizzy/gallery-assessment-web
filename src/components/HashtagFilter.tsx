import type { HashtagWithCount } from '../types'

interface HashtagFilterProps {
  hashtags: HashtagWithCount[]
  activeHashtag: string | null
  onSelect: (hashtag: string | null) => void
}

export default function HashtagFilter({ hashtags, activeHashtag, onSelect }: HashtagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          activeHashtag === null
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {hashtags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelect(activeHashtag === tag.name ? null : tag.name)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
            activeHashtag === tag.name
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          #{tag.name}
          <span className="ml-1 text-xs opacity-70">({tag.image_count})</span>
        </button>
      ))}
    </div>
  )
}

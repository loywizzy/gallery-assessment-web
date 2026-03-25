import type { HashtagWithCount } from '../types'

interface HashtagFilterProps {
  hashtags: HashtagWithCount[]
  activeHashtags: string[]
  onSelect: (hashtag: string | null) => void
}

export default function HashtagFilter({ hashtags, activeHashtags, onSelect }: HashtagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          activeHashtags.length === 0
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {hashtags.map((tag) => {
        const isActive = activeHashtags.includes(tag.name)
        return (
          <button
            key={tag.id}
            onClick={() => onSelect(tag.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-md border-2 border-blue-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
            }`}
          >
            #{tag.name}
            <span className="ml-1 text-xs opacity-70">({tag.image_count})</span>
          </button>
        )
      })}
    </div>
  )
}

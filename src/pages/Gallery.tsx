import { useState, useEffect, useCallback } from 'react'
import Masonry from 'react-masonry-css'
import ImageCard from '../components/ImageCard'
import HashtagFilter from '../components/HashtagFilter'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { getImages, getHashtags } from '../services/api'
import type { Image, HashtagWithCount } from '../types'

const LIMIT = 15

const breakpointColumns = {
  default: 4,
  1280: 3,
  768: 2,
  500: 1,
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([])
  const [hashtags, setHashtags] = useState<HashtagWithCount[]>([])
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // Fetch hashtags list
  useEffect(() => {
    getHashtags()
      .then(setHashtags)
      .catch((err) => console.error('Failed to fetch hashtags:', err))
  }, [])

  // Fetch images (initial + pagination)
  const fetchImages = useCallback(async (pageNum: number, hashtag: string | null, append: boolean) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await getImages(pageNum, LIMIT, hashtag ?? undefined)
      setImages((prev) => (append ? [...prev, ...res.data] : res.data))
      setHasMore(res.has_more)
    } catch (err) {
      console.error('Failed to fetch images:', err)
    } finally {
      setLoading(false)
    }
  }, [loading])

  // Initial load & hashtag change
  useEffect(() => {
    setPage(1)
    setImages([])
    setHasMore(true)
    fetchImages(1, activeHashtag, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHashtag])

  // Load more
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchImages(nextPage, activeHashtag, true)
    }
  }, [loading, hasMore, page, activeHashtag, fetchImages])

  const lastElementRef = useInfiniteScroll(loadMore, hasMore && !loading)

  const handleHashtagClick = (hashtag: string) => {
    setActiveHashtag((prev) => (prev === hashtag ? null : hashtag))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            📸 Image Gallery
          </h1>
          <HashtagFilter
            hashtags={hashtags}
            activeHashtag={activeHashtag}
            onSelect={setActiveHashtag}
          />
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-4 -ml-4"
          columnClassName="pl-4"
        >
          {images.map((image) => (
            <ImageCard key={image.id} image={image} onHashtagClick={handleHashtagClick} />
          ))}
        </Masonry>

        {/* Infinite scroll sentinel */}
        {hasMore && <div ref={lastElementRef} className="h-10" />}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* No more images */}
        {!hasMore && images.length > 0 && (
          <p className="text-center text-gray-400 py-8">No more images to load</p>
        )}

        {/* Empty state */}
        {!loading && images.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-lg">No images found</p>
        )}
      </main>
    </div>
  )
}

// Types สำหรับ Image Gallery

export interface Hashtag {
  id: number
  name: string
}

export interface Image {
  id: number
  title: string
  url: string
  width: number
  height: number
  description: string | null
  created_at: string
  hashtags: Hashtag[]
}

export interface ImagesResponse {
  data: Image[]
  page: number
  limit: number
  total: number
  has_more: boolean
}

export interface HashtagWithCount extends Hashtag {
  image_count: number
}

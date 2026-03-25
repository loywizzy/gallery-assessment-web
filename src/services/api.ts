import axios from 'axios'
import type { ImagesResponse, HashtagWithCount } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

/**
 * ดึงรูปภาพทั้งหมด (รองรับ Infinite Scroll + Hashtag Filter)
 */
export const getImages = async (
  page: number = 1,
  limit: number = 15,
  hashtag?: string
): Promise<ImagesResponse> => {
  const params: Record<string, string | number> = { page, limit }
  if (hashtag) params.hashtag = hashtag

  const { data } = await api.get<ImagesResponse>('/images', { params })
  return data
}

/**
 * ดึง Hashtag ทั้งหมดพร้อม count
 */
export const getHashtags = async (): Promise<HashtagWithCount[]> => {
  const { data } = await api.get<HashtagWithCount[]>('/hashtags')
  return data
}

export default api

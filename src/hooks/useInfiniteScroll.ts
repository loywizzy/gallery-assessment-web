import { useRef, useCallback } from 'react'

/**
 * Custom hook สำหรับ Infinite Scroll ด้วย IntersectionObserver
 */
export function useInfiniteScroll(
  onIntersect: () => void,
  enabled: boolean = true
) {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!enabled) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onIntersect()
          }
        },
        { threshold: 0.1 }
      )

      if (node) observer.current.observe(node)
    },
    [onIntersect, enabled]
  )

  return lastElementRef
}

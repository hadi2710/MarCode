import { useEffect } from 'react'

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const descriptionTag = description ? document.querySelector('meta[name="description"]') : null
    const previousDescription = descriptionTag?.getAttribute('content') ?? null
    if (descriptionTag && description) descriptionTag.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      if (descriptionTag && previousDescription !== null) descriptionTag.setAttribute('content', previousDescription)
    }
  }, [title, description])
}

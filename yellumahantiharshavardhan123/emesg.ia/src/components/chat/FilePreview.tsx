export default function FilePreview({ url }: { url: string }) {
  const isImage = /(png|jpg|jpeg|gif|webp)$/i.test(url)
  const isVideo = /(mp4|webm|ogg)$/i.test(url)
  if (isImage) return <img src={url} className="rounded-lg max-h-64" />
  if (isVideo) return (
    <video controls className="rounded-lg max-h-64">
      <source src={url} />
    </video>
  )
  return (
    <a href={url} target="_blank" className="underline">
      {url.split('/').pop()}
    </a>
  )
}

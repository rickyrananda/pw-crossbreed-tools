interface Props {
    src: string | null
    alt: string
    className?: string
}

export default function ItemImage({ src, alt, className }: Props) {
    if (!src) return <div className={`bg-white/5 rounded ${className}`} />
    const proxied = `/api/img?url=${encodeURIComponent(src)}`
    return (
        <img
            src={proxied}
            alt={alt}
            className={className}
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
        />
    )
}
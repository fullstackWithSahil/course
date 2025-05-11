import React, { useState, useCallback, ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react'
import { Upload, X, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MediaUploaderProps {
    type: 'video' | 'image'
    file: File | null
    setFile: (file: File | null) => void
    onCancel: () => void
    onUpload: () => void
    previewUrl: string
    setPreviewUrl: Dispatch<SetStateAction<string>>
    resetKey?: number // Add a key to trigger reset
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
    type,
    file,
    setFile,
    onCancel,
    onUpload,
    previewUrl,
    setPreviewUrl,
    resetKey = 0,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [localPreview, setLocalPreview] = useState<string>(previewUrl)
    const [uploaded, setUploaded] = useState(false)

    // Reset component when resetKey changes
    useEffect(() => {
        if (resetKey > 0) {
            if (localPreview) {
                URL.revokeObjectURL(localPreview)
            }
            setLocalPreview("")
            setUploaded(false)
        }
    }, [resetKey])

    // Update local preview when previewUrl changes (for initialization)
    useEffect(() => {
        setLocalPreview(previewUrl)
    }, [previewUrl])

    const handleUpload = () => {
        setPreviewUrl(localPreview)
        onUpload()
        setUploaded(true)
    }

    const acceptedTypes = {
        image: 'image/*',
        video: 'video/mp4'
    }

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const processFile = (newFile: File) => {
        if (newFile && (
            (type === 'image' && newFile.type.startsWith('image/')) ||
            (type === 'video' && newFile.type === 'video/mp4')
        )) {
            setFile(newFile)
            const objectUrl = URL.createObjectURL(newFile)
            setLocalPreview(objectUrl)

            // Clean up the object URL when component unmounts
            return () => {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const newFile = e.dataTransfer.files[0]
        if (newFile) {
            processFile(newFile)
        }
    }, [type, setFile])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0]
        if (newFile) {
            processFile(newFile)
        }
    }

    const handleCancel = () => {
        if (localPreview) {
            URL.revokeObjectURL(localPreview)
        }
        setFile(null)
        setLocalPreview("")
        setUploaded(false)
        onCancel()
    }

    const renderPreview = () => {
        if (!localPreview) return null

        if (type === 'image') {
            return (
                <img 
                    src={localPreview} 
                    alt="Preview" 
                    className="max-h-64 w-auto object-contain mx-auto"
                />
            )
        }

        return (
            <video 
                src={localPreview} 
                controls
                className="max-h-64 w-auto mx-auto"
            >
                Your browser does not support the video tag.
            </video>
        )
    }

    const renderUploadIcon = () => {
        return type === 'image' ? (
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
        ) : (
            <Play className="w-12 h-12 text-gray-400 mb-2" />
        )
    }

    const renderDropzoneText = () => (
        <p className="text-sm text-gray-500 text-center">
            Drag and drop {type === 'image' ? 'an image' : 'a video'} or click to upload
            {type === 'video' && (
                <span className="block text-xs text-gray-400 mt-1">
                    (MP4 format only)
                </span>
            )}
        </p>
    )

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="text-lg font-semibold">
                Upload {type === 'image' ? 'Thumbnail' : 'Video'}
            </div>
            
            <div 
                className={`
                    min-h-[200px] border-2 rounded-lg transition-colors duration-200
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {file || localPreview ? (
                    <div className="relative w-full h-full p-4">
                        {renderPreview()}
                        <label className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            <input
                                type="file"
                                accept={acceptedTypes[type]}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {/* Change {type === 'image' ? 'Image' : 'Video'} */}
                        </label>
                    </div>
                ) : (
                    <label className="h-full min-h-[200px] flex flex-col items-center justify-center cursor-pointer p-4">
                        <input
                            type="file"
                            accept={acceptedTypes[type]}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {renderUploadIcon()}
                        {renderDropzoneText()}
                    </label>
                )}
            </div>
            
            {(file && !uploaded) && (
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpload}
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </Button>
                </div>
            )}
        </div>
    )
}

export default MediaUploader;
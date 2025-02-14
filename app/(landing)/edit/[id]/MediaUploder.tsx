import React, { useState, useCallback, ChangeEvent } from 'react';
import { Upload, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploaderProps {
    type: 'video' | 'image';
    onUpload: (media: string | null) => void;
    onCancel: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
    type,
    onUpload,
    onCancel
}) => {
  const [media, setMedia] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const acceptedTypes = {
    image: 'image/*',
    video: 'video/mp4'
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith(type === 'image' ? 'image/' : 'video/mp4')) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setMedia(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [type]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith(type === 'image' ? 'image/' : 'video/mp4')) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setMedia(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    onUpload(media);
  };

  const handleCancel = () => {
    setMedia(null);
    onCancel();
  };

  const renderPreview = () => {
    if (!media) return null;

    if (type === 'image') {
      return (
        <img 
          src={media} 
          alt="Uploaded preview" 
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <video 
        src={media} 
        controls
        className="w-full h-full object-cover"
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        className="w-full flex-1 flex items-center justify-center"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {media ? (
          <div className="w-full h-full relative group">
            {renderPreview()}
            <label 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <input
                type="file"
                accept={acceptedTypes[type]}
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-white text-sm">Change {type === 'image' ? 'Image' : 'Video'}</span>
            </label>
          </div>
        ) : (
          <label className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
            <input
              type="file"
              accept={acceptedTypes[type]}
              onChange={handleFileChange}
              className="hidden"
            />
            {type === 'image' ? (
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
            ) : (
              <Play className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-500">
              Drag and drop {type === 'image' ? 'an image' : 'a video'} or click to upload
              {type === 'video' && <span className="block text-xs text-gray-400">(MP4 only)</span>}
            </p>
          </label>
        )}
      </div>
      
      {media && (
        <div className="flex justify-end gap-2 p-4 border-t">
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
  );
};

export default MediaUploader;
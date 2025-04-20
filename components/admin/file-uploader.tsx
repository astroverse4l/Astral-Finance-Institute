"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FileUploaderProps {
  onUpload: (url: string) => void
  currentImage?: string
  acceptedFileTypes?: string
  maxSize?: number
}

export function FileUploader({
  onUpload,
  currentImage,
  acceptedFileTypes = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)

      try {
        // Create a preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // In a real app, you would upload the file to your server or a storage service
        // For this demo, we'll simulate an upload delay and use the local preview URL
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll just use the preview URL
        // In a real app, you would get the URL from your server response
        onUpload(objectUrl)

        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully.",
        })
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error uploading your file.",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [acceptedFileTypes]: [],
    },
    maxSize,
    multiple: false,
  })

  const removeImage = () => {
    setPreviewUrl(null)
    onUpload("")
  }

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative">
          <ImageIcon
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 hover:border-white/40 bg-white/5"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white/10 rounded-full">
              {isUploading ? (
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Upload className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="text-white font-medium">
              {isDragActive ? "Drop the file here" : isUploading ? "Uploading..." : "Drag & drop or click to upload"}
            </div>
            <p className="text-white/50 text-sm">
              {acceptedFileTypes.replace("/*", " files")} (max {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

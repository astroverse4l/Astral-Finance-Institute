"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/admin/dashboard-header"
import { FileUploader } from "@/components/admin/file-uploader"

const categories = ["forex", "crypto", "web3", "stocks", "derivatives", "shares"]
const levels = ["Beginner", "Intermediate", "Advanced"]

export default function NewCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    duration: "",
    price: 0,
    isDemo: false,
    instructor: "",
    imageUrl: "",
    featured: false,
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCourseData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = (url: string) => {
    setCourseData((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create course")
      }

      toast({
        title: "Success",
        description: "Course created successfully",
      })

      router.push("/admin/courses")
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Course Information</CardTitle>
                  <CardDescription className="text-white/70">Basic information about the course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={courseData.title}
                      onChange={handleChange}
                      placeholder="Enter course title"
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={courseData.description}
                      onChange={handleChange}
                      placeholder="Enter course description"
                      className="bg-white/10 border-white/20 text-white min-h-32"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">
                        Category
                      </Label>
                      <Select
                        value={courseData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="capitalize">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-white">
                        Level
                      </Label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) => handleSelectChange("level", value)}
                        required
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">
                        Duration
                      </Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={courseData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 8 hours"
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={courseData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor" className="text-white">
                      Instructor
                    </Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={courseData.instructor}
                      onChange={handleChange}
                      placeholder="Enter instructor name"
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Course Image</CardTitle>
                  <CardDescription className="text-white/70">Upload a cover image for the course</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    onUpload={handleImageUpload}
                    currentImage={courseData.imageUrl}
                    acceptedFileTypes="image/*"
                  />
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Course Settings</CardTitle>
                  <CardDescription className="text-white/70">Additional course settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isDemo" className="text-white">
                      Free Demo Course
                    </Label>
                    <Switch
                      id="isDemo"
                      checked={courseData.isDemo}
                      onCheckedChange={(checked) => handleSwitchChange("isDemo", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="text-white">
                      Featured Course
                    </Label>
                    <Switch
                      id="featured"
                      checked={courseData.featured}
                      onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white"
                  onClick={() => router.push("/admin/courses")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gradient-button" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

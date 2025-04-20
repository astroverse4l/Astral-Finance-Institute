import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import prisma from "@/lib/prisma"
import DashboardHeader from "@/components/admin/dashboard-header"
import { DataTable } from "@/components/admin/data-table"
import { formatDate } from "@/lib/utils"

export default async function AllCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  })

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-white/50 text-xs">{row.original.id}</div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div className="capitalize">{row.original.category}</div>,
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <div>${row.original.price.toFixed(2)}</div>,
    },
    {
      accessorKey: "students",
      header: "Students",
      cell: ({ row }) => <div>{row.original.students.toLocaleString()}</div>,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <div>{row.original.rating.toFixed(1)}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => <div>{formatDate(row.original.updatedAt)}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" className="border-white/20 text-white h-8" asChild>
            <Link href={`/admin/courses/${row.original.id}`}>Edit</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 text-white h-8" asChild>
            <Link href={`/courses/${row.original.category}/${row.original.id}`} target="_blank">
              View
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">All Courses</h1>
          <Button className="gradient-button" asChild>
            <Link href="/admin/courses/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Course
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={courses} searchKey="title" searchPlaceholder="Search courses..." />
      </div>
    </div>
  )
}

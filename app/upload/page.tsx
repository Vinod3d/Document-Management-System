"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, Image, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const names = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Emily Brown",
  "David Wilson",
];
const departments = ["HR", "Finance", "IT", "Marketing", "Operations", "Legal"];

const UploadPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState<string>("")
  const [remarks, setRemarks] = useState<string>("")
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const subCategoryOptions = category === "Personal" ? names : departments;

  const handleTagKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) =>{
    if (e.key === 'Enter' && tagInput){
        e.preventDefault()
        if (!tags.includes(tagInput)) {
          setTags([...tags, tagInput])
        }
        setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string)=>{
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const validFiles = newFiles.filter((file) => {
        const isValid = file.type === "application/pdf" || file.type.startsWith("image/")
        if (!isValid) {
          toast.error("Invalid file type", {
            description: "Only PDF and image files are allowed",
            style: {
              backgroundColor: "#dd4646",
              color: "white",
              border: "1px solid #DC2626",
              fontWeight: "bold",
            },
          })
        }
        return isValid
      })
      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  const handleDrag = (e:React.DragEvent)=>{
    e.preventDefault()
    e.stopPropagation()
    if(e.type === "dragenter" || e.type === "dragover"){
      setDragActive(true)
    } else if(e.type === "dragleave"){
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      const validFiles = newFiles.filter((file) => {
        const isValid = file.type === "application/pdf" || file.type.startsWith("image/")
        if (!isValid) {
          toast.error("Invalid file type", {
            description: "Only PDF and image files are allowed",
            style: {
              backgroundColor: "#dd4646",
              color: "white",
              border: "1px solid #DC2626",
              fontWeight: "bold",
            },
          })
        }
        return isValid
      })
      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      toast.error(
        "No files selected", {
        description: "Please select at least one file to upload",
        style: {
          backgroundColor: "#dd4646",
          color: "white",
          border: "1px solid #DC2626",
          fontWeight: "bold",
        },
      })
      return
    }

    if (!category || !subCategory) {
      toast.error(
        "Missing information", {
        description: "Please select both category and subcategory",
        style: {
          backgroundColor: "#dd4646",
          color: "white",
          border: "1px solid #DC2626",
          fontWeight: "bold",
        },
      })
      return
    }

    toast.success("Upload Successful", {
      description: "Your files have been uploaded successfully.",
      style: {
        backgroundColor: "#2da158",
        color: "white",
        border: "1px solid #065F46",
        fontWeight: "bold",
      },
    });

    // Reset form
    setDate(new Date())
    setCategory("")
    setSubCategory("")
    setTags([])
    setRemarks("")
    setFiles([])
  }

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Upload Documents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload and categorize your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* subcategory */}
              <div className="space-y-2">
                <Label htmlFor="subcategory">
                  {category === "Personal"
                    ? "Name"
                    : category === "Professional"
                    ? "Department"
                    : "Subcategory"}
                </Label>
                <Select
                  value={subCategory}
                  onValueChange={setSubCategory}
                  disabled={!category}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Select ${
                        category === "Personal" ? "name" : "department"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {subCategoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Tages</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="relative">
                  <Input
                    id="tags"
                    placeholder="Add tags and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Add any additional information about the document"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="files">Upload Files (PDF or Images only)</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                    dragActive ? "border-primary" : "border-muted-foreground/25",
                  )}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, GIF</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="files"
                    multiple
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {
                  files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Selected Files</Label>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              {file.type === "application/pdf" ? (
                                <FileText className="h-5 w-5 text-red-500"/>
                              ) :(
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <Image className="h-5 w-5 text-blue-500" />
                              )}
                              <span className="text-sm truncate max-w-[200px] md:max-w-[300px]">{file.name}</span>
                              <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            removeFile(file)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                          </div>
                        ))
                      }
                      </div>
                    </div>
                  )
                }
            </div>
              <Button type="submit" className="w-full md:w-auto">
                Upload Documents
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;

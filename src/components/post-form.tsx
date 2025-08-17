"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostType } from "@/types/post-type";

interface PostFormProps {
  postType: PostType;
  titlePrefix: string;
  description: string;
}

export default function PostForm({
  postType,
  titlePrefix,
  description,
}: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null); // reset response sebelumnya

    try {
      const formData = new FormData();
      formData.append("type", postType);
      formData.append("title", title);
      formData.append("content", content);

      if (selectedFile) formData.append("thumbnail", selectedFile);
      if (isEventOrProject && location) formData.append("location", location);
      if (isEventOrProject && startDate)
        formData.append("startDate", startDate.toISOString());
      if (isEventOrProject && endDate)
        formData.append("endDate", endDate.toISOString());

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setApiResponse(data.message); // simpan data API ke state

      if (res.ok) {
        toast.success(`Successfully created ${postType.toLowerCase()}!`);
        setTitle("");
        setContent("");
        setThumbnailPreview(null);
        setSelectedFile(null);
        setLocation("");
        setStartDate(undefined);
        setEndDate(undefined);
      } else {
        toast.error(
          `Failed to create ${postType.toLowerCase()}: ${
            data.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const isEventOrProject =
    postType === PostType.AGENDA || postType === PostType.WEBINAR;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setThumbnailPreview(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{titlePrefix} Post</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder={`Enter ${postType.toLowerCase()} title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder={`Write your ${postType.toLowerCase()} content here...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {thumbnailPreview && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected Image Preview:
                </p>
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  width={200}
                  height={150}
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </div>

          {isEventOrProject && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Online, New York City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}>
            {loading ? "Submitting..." : `Create ${postType}`}
          </Button>
          {apiResponse && (
            <div className="mt-4 p-4 border rounded bg-muted">
              <h3 className="font-semibold">API Response:</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

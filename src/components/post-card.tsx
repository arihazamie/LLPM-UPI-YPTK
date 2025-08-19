import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Post } from "@/types/post-type";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  basePath: string;
}

export function PostCard({ post, basePath }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      {post.thumbnail && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-red-100 to-yellow-100 text-red-700 border-0">
            {post.type.replace("_", " ")}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(post.createdAt.toString())}
          </div>
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-red-600 transition-colors line-clamp-2">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-1" />
            {post.author?.name}
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="group/btn">
            <Link href={`${basePath}/${post.id}`}>
              Baca Selengkapnya
              <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

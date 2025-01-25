'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, Flag } from 'lucide-react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    pledgeAmount?: number;
  };
  content: string;
  date: string;
  likes: number;
  replies: number;
  isVerifiedBacker: boolean;
}

interface SupporterCommentsProps {
  comments: Comment[];
}

export function SupporterComments({ comments }: SupporterCommentsProps) {
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const toggleComment = (id: string) => {
    setExpandedComments(prev => 
      prev.includes(id) 
        ? prev.filter(commentId => commentId !== id)
        : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporter Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border rounded-lg p-4 space-y-4 transition-all duration-300 hover:border-primary"
          >
            <div className="flex items-start gap-4">
              <Avatar>
                {comment.author.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.name} />
                ) : (
                  <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center font-medium">
                    {comment.author.name[0]}
                  </div>
                )}
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.author.name}</span>
                  {comment.isVerifiedBacker && (
                    <Badge variant="secondary" className="text-xs">
                      Verified Backer
                    </Badge>
                  )}
                  {comment.author.pledgeAmount && (
                    <Badge variant="outline" className="text-xs">
                      ${comment.author.pledgeAmount}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(comment.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className={`space-y-4 ${
              expandedComments.includes(comment.id) ? '' : 'line-clamp-3'
            }`}>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comment.replies}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComment(comment.id)}
              >
                {expandedComments.includes(comment.id) ? 'Show Less' : 'Read More'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
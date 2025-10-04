"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Reply, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  date: string
  replies?: Comment[]
  isCollapsed?: boolean
}

// Mock comments data with nested replies
const mockComments: Comment[] = [
  {
    id: 1,
    author: "Alex Johnson",
    avatar: "/diverse-avatars.png",
    content:
      "This component is **amazing**! I've been using it in production for a few weeks now and it's been rock solid. The animations are smooth even on lower-end devices.",
    date: "2024-01-16",
    replies: [
      {
        id: 11,
        author: "Sarah Chen",
        avatar: "/diverse-avatars.png",
        content:
          "Totally agree! Have you tried customizing the gradient colors? I found some really nice combinations.",
        date: "2024-01-16",
        replies: [
          {
            id: 111,
            author: "Alex Johnson",
            avatar: "/diverse-avatars.png",
            content:
              "Yes! I'm using a purple-to-pink gradient for my landing page. The customization panel makes it super easy to experiment.",
            date: "2024-01-16",
          },
        ],
      },
      {
        id: 12,
        author: "Michael Rodriguez",
        avatar: "/diverse-avatars.png",
        content: "What's your performance like on mobile? I'm considering using this for a mobile-first project.",
        date: "2024-01-17",
        replies: [
          {
            id: 121,
            author: "Alex Johnson",
            avatar: "/diverse-avatars.png",
            content:
              "Performance is excellent! I tested on iPhone SE and older Android devices - no issues at all. The CSS transforms are hardware-accelerated.",
            date: "2024-01-17",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    author: "Emma Thompson",
    avatar: "/diverse-avatars.png",
    content:
      "Quick question: does this work with Next.js 14 app router? I'm getting some hydration warnings in my setup.",
    date: "2024-01-15",
    replies: [
      {
        id: 21,
        author: "David Kim",
        avatar: "/diverse-avatars.png",
        content:
          "I'm using it with Next.js 14 app router without issues. Make sure you have the `'use client'` directive at the top of your component file.",
        date: "2024-01-15",
      },
      {
        id: 22,
        author: "Emma Thompson",
        avatar: "/diverse-avatars.png",
        content: "That fixed it! Thanks so much 🙏",
        date: "2024-01-15",
      },
    ],
  },
  {
    id: 3,
    author: "James Wilson",
    avatar: "/diverse-avatars.png",
    content:
      "Love the accessibility score! It's rare to find components that are both beautiful *and* accessible. Great work!",
    date: "2024-01-14",
  },
  {
    id: 4,
    author: "Priya Patel",
    avatar: "/diverse-avatars.png",
    content:
      "Is there a way to disable the hover animation? I want to use this in a context where the scale effect might be distracting.",
    date: "2024-01-13",
    replies: [
      {
        id: 41,
        author: "ComponentVault Team",
        avatar: "/diverse-avatars.png",
        content:
          "Great question! You can remove the `hover:scale-105` class from the component. We're also working on a prop-based API to make this easier in the next version.",
        date: "2024-01-13",
      },
    ],
  },
]

interface CommentItemProps {
  comment: Comment
  depth?: number
  onReply: (commentId: number) => void
  replyingTo: number | null
  replyText: string
  setReplyText: (text: string) => void
  onSubmitReply: () => void
  onCancelReply: () => void
}

function CommentItem({
  comment,
  depth = 0,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply,
}: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const hasReplies = comment.replies && comment.replies.length > 0

  // Simple markdown-like rendering (bold text)
  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className={cn("space-y-3", depth > 0 && "ml-12")}>
      <div className="flex items-start gap-3">
        <img
          src={comment.avatar || "/placeholder.svg"}
          alt={comment.author}
          className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{comment.author}</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-400 text-xs">{comment.date}</span>
              </div>
              {hasReplies && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-6 px-2 text-gray-400 hover:text-white"
                >
                  {isCollapsed ? (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Hide
                    </>
                  )}
                </Button>
              )}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{renderContent(comment.content)}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onReply(comment.id)}
              className="h-7 px-2 text-gray-400 hover:text-purple-300 text-xs"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author}...`}
                className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm resize-none"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={onSubmitReply}
                  className="h-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Post Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancelReply} className="h-8 text-gray-400">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && !isCollapsed && (
        <div className="space-y-3">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentsSectionProps {
  componentId?: string
}

export function CommentsSection({ componentId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest")

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      author: "Current User",
      avatar: "/diverse-avatars.png",
      content: newComment,
      date: new Date().toISOString().split("T")[0],
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId)
    setReplyText("")
  }

  const handleSubmitReply = () => {
    if (!replyText.trim() || replyingTo === null) return

    const reply: Comment = {
      id: Date.now(),
      author: "Current User",
      avatar: "/diverse-avatars.png",
      content: replyText,
      date: new Date().toISOString().split("T")[0],
    }

    // Find and add reply to the correct comment (simplified - in production would need recursive search)
    const updatedComments = comments.map((comment) => {
      if (comment.id === replyingTo) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        }
      }
      return comment
    })

    setComments(updatedComments)
    setReplyingTo(null)
    setReplyText("")
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    // For "top", we'd sort by likes/upvotes in a real implementation
    return 0
  })

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Comments <span className="text-gray-400 text-sm font-normal">({totalComments})</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSortBy("newest")}
            className={cn("h-8", sortBy === "newest" ? "bg-blue-500/20 text-blue-300" : "text-gray-400")}
          >
            Newest
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSortBy("top")}
            className={cn("h-8", sortBy === "top" ? "bg-blue-500/20 text-blue-300" : "text-gray-400")}
          >
            Top Rated
          </Button>
        </div>
      </div>

      {/* New Comment Form */}
      <div className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts, ask questions, or provide feedback... (Markdown supported: **bold**, *italic*)"
          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Supports basic markdown: **bold**, *italic*</p>
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            replyingTo={replyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            onSubmitReply={handleSubmitReply}
            onCancelReply={handleCancelReply}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}

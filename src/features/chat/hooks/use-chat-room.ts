 "use client"

 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
 import { useToast } from "@/hooks/use-toast"
 import { type Message, type ChatRoom } from "../types/chat-types"

 export function useChatRoom(roomId: string) {
   const { toast } = useToast()

   const {
     data: chatRoom,
     isLoading,
     error,
     refetch,
   } = useQuery<ChatRoom, Error>({
     queryKey: ["chatRoom", roomId],
     queryFn: async () => {
       const response = await fetch(`/api/chat/rooms/${roomId}`)
       const result = await response.json()

       if (!response.ok) {
         throw new Error(result.error || "채팅방 정보를 불러오는데 실패했습니다")
       }

       return result.room as ChatRoom
     },
     enabled: !!roomId,
   })

   return {
     chatRoom,
     isLoading,
     error,
     refetch,
   }
 }

 export function useChatMessages(roomId: string) {
   const { toast } = useToast()

   const {
     data: messages,
     isLoading,
     error,
     refetch,
   } = useQuery<Message[], Error>({
     queryKey: ["messages", roomId],
     queryFn: async () => {
       const response = await fetch(`/api/messages?roomId=${roomId}`)
       const result = await response.json()

       if (!response.ok) {
         throw new Error(result.error || "메시지를 불러오는데 실패했습니다")
       }
       return result.messages
     },
     enabled: !!roomId,
     refetchInterval: 5000, // 5초마다 새로운 메시지 확인
   })

   if (error) {
     toast({
       title: "메시지 불러오기 실패",
       description: error.message,
       variant: "destructive",
     })
   }

   return {
     messages: messages || [],
     isLoading,
     error,
     refetch,
   }
 }

 export function useSendMessage() {
   const queryClient = useQueryClient()
   const { toast } = useToast()

   return useMutation({
     mutationFn: async ({ roomId, senderId, content }: { roomId: string; senderId: string; content: string }) => {
       const response = await fetch("/api/messages", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ roomId, senderId, content }),
       })

       const result = await response.json()

       if (!response.ok) {
         throw new Error(result.error || "메시지 전송에 실패했습니다")
       }

       return result.message as Message
     },
     onSuccess: (data, variables) => {
       // 메시지 목록 업데이트
       queryClient.invalidateQueries({ queryKey: ["messages", variables.roomId] })
       // 채팅방 목록 업데이트 (마지막 메시지 변경)
       queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
       queryClient.invalidateQueries({ queryKey: ["chatRoom", variables.roomId] })
     },
     onError: (error) => {
       toast({
         title: "메시지 전송 실패",
         description: error.message,
         variant: "destructive",
       })
     },
   })
 }

 export function useMarkMessagesAsRead() {
   const queryClient = useQueryClient()

   return useMutation({
     mutationFn: async ({ roomId, userId }: { roomId: string; userId: string }) => {
       const response = await fetch("/api/messages/read", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ roomId, userId }),
       })

       const result = await response.json()

       if (!response.ok) {
         throw new Error(result.error || "읽음 처리에 실패했습니다")
       }

       return result
     },
     onSuccess: (data, variables) => {
       queryClient.invalidateQueries({ queryKey: ["messages", variables.roomId] })
       queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
       queryClient.invalidateQueries({ queryKey: ["chatRoom", variables.roomId] })
     },
   })
 }

 export function useTypingIndicator(roomId: string) {
   const queryClient = useQueryClient()

   const startTyping = useMutation({
     mutationFn: async ({ userId, userName }: { userId: string; userName: string }) => {
       const response = await fetch(`/api/chat/rooms/${roomId}/typing`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ userId, userName, isTyping: true }),
       })

       if (!response.ok) {
         throw new Error("타이핑 상태 업데이트 실패")
       }

       return response.json()
     },
   })

   const stopTyping = useMutation({
     mutationFn: async ({ userId }: { userId: string }) => {
       const response = await fetch(`/api/chat/rooms/${roomId}/typing`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ userId, isTyping: false }),
       })

       if (!response.ok) {
         throw new Error("타이핑 상태 업데이트 실패")
       }

       return response.json()
     },
   })

   return {
     startTyping,
     stopTyping,
   }
 }
 
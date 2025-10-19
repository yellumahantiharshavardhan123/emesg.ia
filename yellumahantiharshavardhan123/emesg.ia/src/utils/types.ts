export type UUID = string

export type Profile = {
  id: UUID
  name: string | null
  photo_url: string | null
  status?: string | null
  last_seen?: string | null
  bio?: string | null
}

export type Chat = {
  id: UUID
  user1_id: UUID
  user2_id: UUID
  created_at: string
}

export type Message = {
  id: UUID
  chat_id: UUID
  sender_id: UUID
  content: string | null
  media_url: string | null
  created_at: string
  seen: boolean
  delivered: boolean
}

export type Group = {
  id: UUID
  name: string
  photo: string | null
  created_by: UUID
  participants: UUID[]
  created_at: string
}

export type GroupMessage = {
  id: UUID
  group_id: UUID
  sender_id: UUID
  content: string | null
  media_url: string | null
  created_at: string
}

export type GroupRead = {
  group_id: UUID
  user_id: UUID
  last_read_at: string
}

export type Vibe = {
  id: UUID
  user_id: UUID
  content_url: string | null
  caption: string | null
  created_at: string
  expires_at: string
}

import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileEditor from '@/components/profile/ProfileEditor'

export default function Profile() {
  const { id } = useParams()
  const { user } = useAuth()
  const isSelf = !id || id === user?.id

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        {isSelf ? <ProfileEditor /> : <ProfileCard userId={id!} />}
      </div>
    </div>
  )
}

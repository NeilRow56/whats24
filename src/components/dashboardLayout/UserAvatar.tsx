import { Avatar } from '@/components/ui/avatar'
import type { AvatarProps } from '@radix-ui/react-avatar'
import type { User } from 'next-auth'
import Image from 'next/image'

type Props = Partial<AvatarProps> & {
  user: User | undefined
}

function UserAvatar({ user, ...avatarProps }: Props) {
  return (
    <Avatar className="relative h-8 w-8" {...avatarProps}>
      <Image
        src={user?.image || '/neil.jpg'}
        fill
        sizes="(max-width: 68px) 100vw, (max-width: 200px) 50vw, 33vw"
        alt={`${user?.name}'s profile picture`}
        className="rounded-full object-cover"
      />
    </Avatar>
  )
}

export default UserAvatar

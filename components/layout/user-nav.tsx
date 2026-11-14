
import UserNavClient from './user-nav-client'
import { getSession } from '@/lib/session';

async function UserNav() {
    const session = await getSession();
  return (

    <div>
      <UserNavClient session={session} />
    </div>
  )
}

export default UserNav

import { Slash } from 'lucide-react'
import Image from 'next/image'

import RocketseatIconSvg from '@/assets/rocketseat-icon.svg'
import { ability } from '@/auth/auth'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b pb-2">
      <div className="flex items-center gap-3">
        <Image
          src={RocketseatIconSvg}
          alt="Rocketseat"
          className="size-6 dark:invert"
        />

        <Slash className="text-border size-6 -rotate-[24deg]" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="text-border size-6 -rotate-[24deg]" />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator className="h-5" orientation="vertical" />
        <ProfileButton />
      </div>
    </div>
  )
}

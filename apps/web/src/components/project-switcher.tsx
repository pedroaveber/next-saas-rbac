'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getProjects } from '@/http/get-projects'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export function ProjectSwitcher() {
  const { slug: organizationSlug, project: projectSlug } = useParams<{
    slug: string
    project: string
  }>()

  const { data, isLoading } = useQuery({
    queryFn: () => getProjects(organizationSlug),
    queryKey: [organizationSlug, 'projects'],
    enabled: !!organizationSlug,
  })

  const currentProject =
    data && projectSlug
      ? (data.projects.find((project) => project.slug === projectSlug) ?? null)
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {isLoading ? (
          <>
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full rounded-md" />
          </>
        ) : (
          <>
            {currentProject ? (
              <>
                <Avatar className="size-4">
                  {currentProject.avatarUrl && (
                    <AvatarImage src={currentProject.avatarUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>

                <span className="truncate text-left">
                  {currentProject.name}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">Select project</span>
            )}
          </>
        )}

        {isLoading ? (
          <Loader2 className="text-muted-foreground ml-auto size-4 shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDown className="text-muted-foreground ml-auto size-4 shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" sideOffset={12} className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data &&
            data.projects.map((project) => (
              <DropdownMenuItem asChild key={project.id}>
                <Link href={`/org/${organizationSlug}/project/${project.slug}`}>
                  <Avatar className="mr-2 size-4">
                    {project.avatarUrl && (
                      <AvatarImage src={project.avatarUrl} />
                    )}
                    <AvatarFallback />
                  </Avatar>

                  <span className="line-clamp-1">{project.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/org/${organizationSlug}/create-project`}>
            <PlusCircle className="text-primary mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

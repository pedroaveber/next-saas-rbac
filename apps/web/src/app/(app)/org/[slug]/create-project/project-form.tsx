'use client'

import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'

import { createProjectAction } from './actions'

export function ProjectForm() {
  const { slug: organizationSlug } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()

  const [{ errors, message, success }, handleSaveProject, isPending] =
    useFormState(createProjectAction, () =>
      queryClient.invalidateQueries({
        queryKey: [organizationSlug, 'projects'],
      }),
    )

  return (
    <div className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSaveProject} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Project Name</Label>
          <Input name="name" id="name" />

          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Project Description</Label>
          <Textarea name="description" id="description" />

          {errors?.description && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.description[0]}
            </p>
          )}
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Save project'
          )}
        </Button>
      </form>
    </div>
  )
}

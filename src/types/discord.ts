export type CommandOption = {
  name: string
  description: string
  type: number
  required?: boolean
  choices?: { name: string; value: string | number }[]
  options?: CommandOption[]
}

export type AppCommand = {
  id: string
  type: 1 | 2 | 3          // 1=CHAT_INPUT, 2=USER, 3=MESSAGE
  name: string
  description: string
  options?: CommandOption[]
  default_member_permissions: string | null
  dm_permission: boolean
}
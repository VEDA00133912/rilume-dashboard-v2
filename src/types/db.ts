export type BlacklistUser = {
  userId: string
  addedAt: Date
}

export type Expand = {
  guildId: string
  expand: boolean
}

export type Impersonate = {
  guildId: string
  channelId: string | null
  webhookId: string | null
  webhookToken: string | null
  enabled: boolean
}

export type ImpersonateLog = {
  guildId: string
  executorId: string
  messageId: string
  executedAt: Date
}
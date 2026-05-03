import mongoose, { model, Schema, models } from "mongoose"

// Blacklist
const BlacklistSchema = new Schema({
  userId:  { type: String, required: true, unique: true },
  addedAt: { type: Date, default: Date.now },
})

// Expand
const ExpandSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  expand:  { type: Boolean, default: true },
})

// Impersonate
const ImpersonateSchema = new Schema({
  guildId:      { type: String, required: true, unique: true },
  channelId:    { type: String, default: null },
  webhookId:    { type: String, default: null },
  webhookToken: { type: String, default: null },
  enabled:      { type: Boolean, default: false },
})

// ImpersonateLog
const ImpersonateLogSchema = new Schema({
  guildId:    { type: String, required: true, index: true },
  executorId: { type: String, required: true },
  messageId:  { type: String, required: true },
  executedAt: { type: Date, default: Date.now },
})

export const Blacklist     = models.BlacklistUser  ?? model("BlacklistUser",  BlacklistSchema)
export const Expand        = models.Expand         ?? model("Expand",         ExpandSchema)
export const Impersonate   = models.Impersonate    ?? model("Impersonate",    ImpersonateSchema)
export const ImpersonateLog = models.ImpersonateLog ?? model("ImpersonateLog", ImpersonateLogSchema)
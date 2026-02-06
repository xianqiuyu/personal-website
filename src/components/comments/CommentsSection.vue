<template>
  <section class="comments">
    <div class="comments-head">
      <h2 class="comments-title">公开评论</h2>
      <p class="comments-subtitle">欢迎路过的朋友留下你的想法（所有人可见）</p>
    </div>

    <form class="comment-form" @submit.prevent="submit">
      <div class="row">
        <label class="label">
          <span>昵称（可选）</span>
          <input v-model.trim="name" maxlength="20" placeholder="匿名 / 你的昵称" />
        </label>
      </div>
      <label class="label">
        <span>评论内容</span>
        <textarea
          v-model.trim="content"
          :maxlength="maxContentLen"
          rows="4"
          placeholder="写点什么吧…（文明发言，拒绝广告/恶意内容）"
        ></textarea>
        <div class="hint">
          <span>{{ content.length }}/{{ maxContentLen }}</span>
        </div>
      </label>

      <div class="actions">
        <button class="btn" type="submit" :disabled="isSubmitting || !content.trim()">
          <span v-if="!isSubmitting && editingId === null">发布评论</span>
          <span v-else-if="!isSubmitting && editingId !== null">保存修改</span>
          <span v-else>发布中...</span>
        </button>
        <button
          v-if="editingId !== null"
          class="ghost"
          type="button"
          @click="cancelEdit"
          :disabled="isSubmitting"
        >
          取消编辑
        </button>
        <span v-if="message" class="message" :class="{ ok: messageType === 'ok', err: messageType === 'err' }">
          {{ message }}
        </span>
      </div>
    </form>

    <div class="list">
      <div class="list-head">
        <h3>最新评论</h3>
        <button class="ghost" type="button" @click="load" :disabled="isLoading">
          刷新
        </button>
      </div>

      <div v-if="isLoading" class="loading">加载中...</div>
      <div v-else-if="comments.length === 0" class="empty">还没有评论，来当第一个吧～</div>

      <ul v-else class="items">
        <li v-for="c in comments" :key="c.id" class="item">
          <div class="meta">
            <div class="meta-main">
              <span class="who">{{ c.name }}</span>
              <span class="dot">·</span>
              <time class="time">{{ formatTime(c.created_at) }}</time>
            </div>
            <div v-if="c.isMine" class="ops">
              <button type="button" class="chip-btn" @click="startEdit(c)">
                ✏️
                <span>编辑</span>
              </button>
              <button type="button" class="chip-btn danger" @click="askRemove(c)">
                🗑
                <span>删除</span>
              </button>
            </div>
          </div>
          <p class="text" v-text="c.content"></p>
        </li>
      </ul>
    </div>

    <!-- 删除确认弹框 -->
    <div v-if="showConfirm" class="confirm-overlay" @click="closeConfirm">
      <div class="confirm-dialog" @click.stop>
        <h3 class="confirm-title">删除这条评论？</h3>
        <p class="confirm-text">
          删除后将无法恢复，只会影响你自己刚才发布的这一条。
        </p>
        <p v-if="confirmTarget" class="confirm-preview">
          “{{ confirmTarget.content }}”
        </p>
        <div class="confirm-actions">
          <button type="button" class="ghost" @click="closeConfirm">先留着</button>
          <button
            type="button"
            class="btn danger"
            @click="confirmRemove"
            :disabled="isSubmitting"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type CommentItem = {
  id: number
  page: string
  name: string
  content: string
  created_at: string
  isMine?: boolean
}

const props = defineProps<{
  page: string
  maxContentLen?: number
}>()

const maxContentLen = props.maxContentLen ?? 800

const name = ref('')
const content = ref('')
const editingId = ref<number | null>(null)

const comments = ref<CommentItem[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'err'>('ok')

const showConfirm = ref(false)
const confirmTarget = ref<CommentItem | null>(null)

const anonUserIdKey = 'anon_user_id_v1'
const anonUserId = ref('')

const ensureAnonUserId = () => {
  if (anonUserId.value) return
  let id = ''
  if (typeof window !== 'undefined') {
    id = window.localStorage.getItem(anonUserIdKey) || ''
  }
  if (!id) {
    if (typeof crypto !== 'undefined' && typeof (crypto as Crypto).randomUUID === 'function') {
      id = (crypto as Crypto).randomUUID()
    } else {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(anonUserIdKey, id)
    }
  }
  anonUserId.value = id
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const setMsg = (type: 'ok' | 'err', text: string) => {
  messageType.value = type
  message.value = text
  setTimeout(() => {
    message.value = ''
  }, 2500)
}

const parseApiJson = (raw: string) => {
  const text = raw.trim()
  if (!text) throw new Error('接口返回空响应')
  const parsed: unknown = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object') throw new Error('接口返回格式不正确')
  return parsed as Record<string, unknown>
}

const getApiError = (obj: Record<string, unknown>) => {
  const err = obj.error
  if (typeof err === 'string' && err.trim()) return err
  return '请求失败'
}

const load = async () => {
  isLoading.value = true
  try {
    const r = await fetch(
      `/api/comments?page=${encodeURIComponent(props.page)}&anonUserId=${encodeURIComponent(anonUserId.value)}`
    )
    const raw = await r.text()
    const obj = parseApiJson(raw)
    if (!r.ok || obj.ok !== true) throw new Error(getApiError(obj))
    comments.value = (obj.comments as CommentItem[]) || []
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '加载失败'
    setMsg('err', msg)
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  if (!content.value.trim()) return
  isSubmitting.value = true
  try {
    const body = {
      page: props.page,
      name: name.value.trim() || '匿名',
      content: content.value.trim(),
      anonUserId: anonUserId.value,
    }

    const url =
      editingId.value != null ? `/api/comments/${editingId.value}` : '/api/comments'
    const method = editingId.value != null ? 'PUT' : 'POST'

    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const raw = await r.text()
    const obj = parseApiJson(raw)
    if (!r.ok || obj.ok !== true) throw new Error(getApiError(obj))

    content.value = ''
    editingId.value = null
    setMsg('ok', method === 'POST' ? '发布成功' : '修改成功')
    await load()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '发布失败'
    setMsg('err', msg)
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (c: CommentItem) => {
  editingId.value = c.id
  content.value = c.content
}

const cancelEdit = () => {
  editingId.value = null
  content.value = ''
}

const doRemove = async (c: CommentItem) => {
  try {
    const r = await fetch(`/api/comments?id=${encodeURIComponent(String(c.id))}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonUserId: anonUserId.value }),
    })
    const raw = await r.text()
    const obj = parseApiJson(raw)
    if (!r.ok || obj.ok !== true) throw new Error(getApiError(obj))

    setMsg('ok', '已删除')
    await load()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '删除失败'
    setMsg('err', msg)
  }
}

const askRemove = (c: CommentItem) => {
  if (!c.isMine) return
  confirmTarget.value = c
  showConfirm.value = true
}

const closeConfirm = () => {
  showConfirm.value = false
  confirmTarget.value = null
}

const confirmRemove = async () => {
  if (!confirmTarget.value) return
  const target = confirmTarget.value
  closeConfirm()
  await doRemove(target)
}

onMounted(() => {
  ensureAnonUserId()
  load()
})
</script>

<style scoped>
.comments {
  margin-top: 2.5rem;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 28px;
  padding: 2.4rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 2px dashed rgba(255, 107, 157, 0.28);
}

.comments-head {
  text-align: center;
  margin-bottom: 1.6rem;
}

.comments-title {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.4rem;
}

.comments-subtitle {
  color: var(--text);
  opacity: 0.75;
}

.comment-form {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.label {
  display: grid;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--text);
}

input,
textarea {
  width: 100%;
  border-radius: 16px;
  border: 2px solid rgba(255, 107, 157, 0.22);
  padding: 0.9rem 1rem;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  background: white;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: rgba(255, 107, 157, 0.6);
  box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.12);
}

.hint {
  display: flex;
  justify-content: flex-end;
  font-weight: 600;
  opacity: 0.7;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  border: none;
  cursor: pointer;
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 35px rgba(255, 107, 157, 0.22);
}

.message {
  font-weight: 700;
}
.message.ok {
  color: #16a34a;
}
.message.err {
  color: #dc2626;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.list-head h3 {
  margin: 0;
  color: var(--primary);
}

.ghost {
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(255, 107, 157, 0.28);
  color: var(--primary);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  font-weight: 800;
  cursor: pointer;
}

.ghost:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.empty {
  padding: 1.2rem 0;
  text-align: center;
  opacity: 0.75;
}

.items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.9rem;
}

.item {
  background: white;
  border-radius: 18px;
  padding: 1rem 1.1rem;
  border: 2px solid rgba(255, 107, 157, 0.14);
}

.meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.meta-main {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.who {
  color: var(--text);
}

.dot,
.time {
  opacity: 0.65;
  font-weight: 700;
}

.text {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.7;
}

.ops {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary);
  box-shadow: 0 4px 10px rgba(255, 107, 157, 0.16);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.chip-btn span {
  position: relative;
  top: 0.5px;
}

.chip-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(255, 107, 157, 0.22);
  background: rgba(255, 255, 255, 1);
}

.chip-btn.danger {
  background: rgba(248, 113, 113, 0.08);
  color: #dc2626;
  box-shadow: 0 4px 10px rgba(248, 113, 113, 0.18);
}

.chip-btn.danger:hover {
  box-shadow: 0 8px 18px rgba(248, 113, 113, 0.26);
}

.btn.danger {
  background: linear-gradient(135deg, #f97373, #ef4444);
}

.btn.danger:hover:not(:disabled) {
  box-shadow: 0 18px 35px rgba(248, 113, 113, 0.32);
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.confirm-dialog {
  width: min(420px, 90vw);
  background: #ffffff;
  border-radius: 24px;
  padding: 1.6rem 1.8rem;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.38);
  border: 2px solid rgba(255, 107, 157, 0.2);
}

.confirm-title {
  margin: 0 0 0.6rem;
  font-size: 1.3rem;
  color: var(--primary);
}

.confirm-text {
  margin: 0 0 0.6rem;
  color: var(--text);
  opacity: 0.85;
  font-size: 0.95rem;
}

.confirm-preview {
  margin: 0 0 1rem;
  padding: 0.6rem 0.8rem;
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.9);
  border: 1px dashed rgba(148, 163, 184, 0.7);
  font-size: 0.9rem;
  max-height: 5.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
}

.confirm-actions .ghost {
  padding-inline: 1.1rem;
}

@media (max-width: 768px) {
  .comments {
    padding: 2rem 1.4rem;
  }
}
</style>


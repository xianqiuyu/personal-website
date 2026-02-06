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
          <span v-if="!isSubmitting">发布评论</span>
          <span v-else>发布中...</span>
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
            <span class="who">{{ c.name }}</span>
            <span class="dot">·</span>
            <time class="time">{{ formatTime(c.created_at) }}</time>
          </div>
          <p class="text" v-text="c.content"></p>
        </li>
      </ul>
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
}

const props = defineProps<{
  page: string
  maxContentLen?: number
}>()

const maxContentLen = props.maxContentLen ?? 800

const name = ref('')
const content = ref('')

const comments = ref<CommentItem[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'err'>('ok')

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

const load = async () => {
  isLoading.value = true
  try {
    const r = await fetch(`/api/comments?page=${encodeURIComponent(props.page)}`)
    const data = await r.json()
    if (!r.ok || !data.ok) throw new Error(data.error || '加载失败')
    comments.value = data.comments
  } catch (e: any) {
    setMsg('err', e?.message || '加载失败')
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  if (!content.value.trim()) return
  isSubmitting.value = true
  try {
    const r = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: props.page,
        name: name.value.trim() || '匿名',
        content: content.value.trim(),
      }),
    })
    const data = await r.json()
    if (!r.ok || !data.ok) throw new Error(data.error || '发布失败')

    content.value = ''
    setMsg('ok', '发布成功')
    await load()
  } catch (e: any) {
    setMsg('err', e?.message || '发布失败')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
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
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
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

@media (max-width: 768px) {
  .comments {
    padding: 2rem 1.4rem;
  }
}
</style>


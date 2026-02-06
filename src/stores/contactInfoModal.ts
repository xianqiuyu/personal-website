import { defineStore } from 'pinia'

export type ContactModalIcon = 'wechat' | 'qq'

interface ContactModalState {
  isOpen: boolean
  title: string
  content: string
  copyText: string
  icon: ContactModalIcon | null
}

export const useContactInfoModalStore = defineStore('contactInfoModal', {
  state: (): ContactModalState => ({
    isOpen: false,
    title: '',
    content: '',
    copyText: '',
    icon: null,
  }),
  actions: {
    open(payload: { title: string; content: string; copyText?: string; icon?: ContactModalIcon | null }) {
      this.title = payload.title
      this.content = payload.content
      this.copyText = payload.copyText ?? payload.content
      this.icon = payload.icon ?? null
      this.isOpen = true
    },
    openWeChat(wechatId: string) {
      this.open({ title: '微信号', content: wechatId, copyText: wechatId, icon: 'wechat' })
    },
    openQQ(qqNumber: string) {
      this.open({ title: 'QQ号', content: qqNumber, copyText: qqNumber, icon: 'qq' })
    },
    close() {
      this.isOpen = false
      this.title = ''
      this.content = ''
      this.copyText = ''
      this.icon = null
    },
  },
})


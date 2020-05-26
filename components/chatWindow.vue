<template>
  <div class="chat-window" ref="chatWindow">
    <div class="chat-container" v-if="showChat">
      <div class="chat-header bg-primary text-right d-flex justify-content-end" ref="chatHeader">
        <span class="px-3 py-2">Chat with us</span>
        <button
          class="btn"
          type="button"
          @click="toggleWin"
          aria-label="Toggle chat window"
          :aria-expanded="toggleChat"
        >
          <span
            class="fa"
            :class="{'fa-window-minimize': toggleChat, 'fa-window-maximize': !toggleChat}"
          ></span>
        </button>
        <button
          class="btn btn-close"
          type="button"
          @click="closeChat"
          aria-label="Close chat window"
        ></button>
      </div>
      <iframe class="chat-iframe" :src="chatUrl" v-show="toggleChat" ref="chatIFrame"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ['chatUrl'],
  data: function data() {
    return {
      showChat: false,
      toggleChat: true
    }
  },
  created() {
    // use local browser storage to persist state across pages
    this.showChat = localStorage.getItem('showChatWindow') === 'true'
    var vm = this
    this.$root.$on('OpenChatWindow', function() {
      this.$nextTick(function() {
        localStorage.setItem('showChatWindow', 'true')
        vm.showChat = true
      })
    })
  },

  methods: {
    closeChat() {
      this.showChat = false
      localStorage.removeItem('showChatWindow')
    },
    toggleWin() {
      this.toggleChat = !this.toggleChat
    }
  }
}
</script>
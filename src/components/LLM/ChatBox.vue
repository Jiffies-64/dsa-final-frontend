<template>
  <div class="chat-container">
    <div>连接状态：{{ connected }}</div>
    <div class="chat-box" id="llm-response">
      <ul
          v-for="(message, index) in chatMessages"
          :key="index"
          class="chat-message"
      >
        <li v-if="message.role === 'user'" class="flex-right">
          <p class="user-message">{{ message.content }}</p>
        </li>
        <li v-else>
          <p class="bot-message">{{ message.content }}</p>
        </li>
      </ul>
    </div>
    <div class="label-container">
      <span v-for="(tItem, tIndex) in quickSelections" :key="tIndex">
        <span v-for="(qItem, index) in tItem.questionItems" :key="index">
         <el-tag :type="(chosenQuestion && qItem.id === chosenQuestion.id) ? 'success' : 'info'"
                 class="quick-selection-label"
                 :id="'quick-selection-label-' + qItem.id"
                 @click="addQuestionToRequest(qItem)"
         >{{ qItem.itemOrder }}</el-tag>
        </span>
      </span>
    </div>
    <div class="input-container">
      <input
          type="text"
          v-model="inputBoxText"
          @keyup.enter="sendMessage"
          class="message-input"
          placeholder="Type your message here"
      />
      <button @click="sendMessage" :disabled="!connected || generating" class="send-button">
        {{ generating ? 'Waiting' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

export default {
  props: {
    quickSelections: Array
  },
  data () {
    return {
      chatMessages: [{ role: 'robot', content: 'Hello! What can I do for U?' }],
      chosenQuestion: Object,
      inputBoxText: '',
      connected: false,
      generating: false,
      socket: null,
    }
  },
  computed: {
    completeInput: function () {
      let prefix = ''
      if (this.chosenQuestion) {
        prefix = '这里有一道法律相关题目，题干为：' + this.chosenQuestion.title + '请基于该题目回答以下问题：'
      }
      return prefix + this.inputBoxText
    }
  },
  methods: {
    addQuestionToRequest (qItem) {
      if (this.chosenQuestion && this.chosenQuestion.id === qItem.id) {
        this.chosenQuestion = null
        return
      }
      this.chosenQuestion = qItem
    },
    sendMessage () {
      if (this.inputText !== '') {
        this.chatMessages.push({ role: 'user', content: this.completeInput })
        this.socket.emit('prompt', { message: this.chatMessages.filter(x => x.role === 'user') })
        this.inputBoxText = ''
        this.completeInput = ''
        this.generating = true
      }
    },
    handleMessage (msg) {
      if (msg === '<Start>') {
        this.chatMessages.push({ role: 'robot', content: '' })
      } else if (msg === '<End>') {
        this.generating = false
        return
      } else if (msg === '<Irpt>') {
        this.chatMessages[this.chatMessages.length - 1].content += '...'
        this.generating = false
      } else {
        this.chatMessages[this.chatMessages.length - 1].content += msg
      }
    },
  },
  mounted () {
    // 连接socket
    this.socket = io('http://127.0.0.1:8000/llm', {
      transports: ['websocket'],
    })

    // 监听连接成功的事件
    this.socket.on('connect', () => {
      this.connected = true
      console.log('connected!')
    })

    // 设置监听
    this.socket.on('response', (data) => {
      console.log('received!!')
      this.handleMessage(data.message)
    })

    // // 设置心跳
    // setInterval(() => {
    //   this.socket.connect();
    // }, 5000);
  },
  beforeDestroy () {
    // 在组件销毁前关闭WebSocket连接
    if (this.socket) {
      this.socket.close()
      this.connected = false
    }
    this.socket = null
  },
}
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-box {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  overflow-y: auto;
}

.chat-message {
  margin-bottom: 10px;
  /* display: flex; */
}

.chat-message > li {
  display: flex;
  padding: 0 20px;
  overflow: hidden;
}

.bot-message {
  position: relative;
  display: block;
  background-color: #eeeeee;
  /* border: 1px solid #ddd; */
  border-radius: 5px;
  padding: 15px;
  margin: 0;
  min-height: 20px;
  line-height: 20px;
  max-width: 90%;
}

.bot-message::after {
  content: "";
  position: absolute;
  left: -5px;
  width: 15px;
  height: 15px;
  transform: rotate(45deg);
  background-color: #eeeeee;
}

.user-message {
  position: relative;
  display: block;
  background-color: rgb(213, 225, 241);
  border-radius: 5px;
  padding: 15px;
  margin: 0;
  min-height: 20px;
  line-height: 20px;
  max-width: 70%;
}

.user-message::after {
  content: "";
  position: absolute;
  left: -5px;
  width: 15px;
  height: 15px;
  transform: rotate(45deg);
  background-color: rgb(213, 225, 241);
}

.flex-right {
  flex-direction: row-reverse;
}

.flex-right > .user-message::after {
  left: unset;
  right: -5px;
}

.input-container {
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  background-color: #5daafc;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-left: 10px;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

p {
  word-wrap: anywhere;
}

.label-container {
  width: 100%;
  margin-bottom: 5px;
}

.quick-selection-label {
  margin: 5px;
}

.quick-selection-label:hover {
  cursor: pointer;
}
</style>

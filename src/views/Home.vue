<template>
  <div>
    <h1>Chat:</h1>
    <span>
      <ChatBox/>
    </span>
  </div>
</template>

<script>
import ChatBox from "@/components/ChatBox.vue";

export default {
  name: "HomeView",
  components: { ChatBox },
};
</script>

<style scoped>
</style>
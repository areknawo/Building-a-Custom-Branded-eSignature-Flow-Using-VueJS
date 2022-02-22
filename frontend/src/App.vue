<template>
  <h1>Paperwork App</h1>
  <div class="msg" v-if="signed && !error">NDA Signed!</div>
  <div class="msg error" v-else-if="error">Error: "{{ error }}"</div>
  <button class="btn" @click="handleButtonClick" :disabled="loading" v-else>
    {{ loading ? "Loading..." : "Sign NDA" }}
  </button>
</template>
<script lang="ts">
import HelloSign from "hellosign-embedded";
import { defineComponent, ref } from "vue";

const getEmbedUrl = async () => {
  const response = await fetch("/api/signature-request");
  const json = await response.json();

  return json.url;
};

export default defineComponent({
  setup() {
    const client = new HelloSign({
      clientId: "YOUR-CLIENT-ID",
      testMode: true,
    });
    const loading = ref(false);
    const signed = ref(false);
    const error = ref();
    const handleButtonClick = async () => {
      loading.value = true;

      const url = await getEmbedUrl();

      loading.value = false;

      client.open(url);
    };

    client.once("error", ({ code }) => {
      error.value = code;
    });
    client.once("sign", () => {
      signed.value = true;
    });

    return { handleButtonClick, error, signed, loading };
  },
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn,
.msg {
  background: #0ea5e9;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem;
  border: none;
  border-radius: 1rem;
  width: 16rem;
  max-width: calc(100% - 1rem);
}
.error {
  background: #e74c3c;
}
.btn:disabled {
  opacity: 0.7;
}
.btn:hover {
  background: #0284c7;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
    <h1>{{ msg }}</h1>

    <p>PWA WORKS!!!</p>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>

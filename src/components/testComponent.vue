<template>
  <div>
    <button>{{ $attrs.data }}</button>
  </div>

  <div v-bind="$attrs">
    <button>{{ $attrs.data }}</button>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, useAttrs } from "vue";
import { tr } from "element-plus/es/locale";
const props = defineProps({
  text: { type: String, require: false, defualt: "点击" },
});

var aa: any = useAttrs();
console.log("attrs", aa);
</script>



<style>
button {
  width: 100px;
  height: 32px;
  background: white;
  /* background: white; */
  border: 1px rgb(220, 223, 230) solid;
  border-radius: 3px;
}
button:hover {
  background: rgb(236, 245, 255);
  border: rgb(198, 226, 255) 1px solid;
  color: rgb(130, 130, 234);
}
button:active {
  border: 1px rgb(137, 137, 228) solid;
}
</style>
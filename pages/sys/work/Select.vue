<template>

	<view id="app">
	  <Input type="text" v-model="B" ></Input>
		<Button @click="handleKeyDown">123</Button>
	</view>
	


  

</template>
<script>
    // 引入Vue库
    import Vue from 'vue';

    // 创建Vue实例
    new Vue({
      el: '#app',
      data: {
        B: 'q'
      },
      methods: {
        handleKeyDown(e) {
          let key = null;
          if (window.event === undefined) {
            key = e.keyCode;
          } else {
            key = window.event.keyCode;
          }
          if (key === 13) { // 如果按下的键是Enter键
            // 在这里编写处理Enter键按下的逻辑
            console.log('Enter键已按下');
          }
        }
      },
      created() {
        // 监听键盘按下事件
        window.addEventListener('keydown', this.handleKeyDown, true);
      }
    });
  </script>
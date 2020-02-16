<template>
  <div>
    <div
      style="margin: 0; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);text-align: center"
    >
      <v-img src="img/bg.jpg" class="bg" />
      <v-img src="img/head.png" class="head" />
    </div>
  </div>
</template>
    
<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.2s;
}

.fade-enter-active {
  transition-delay: 0.2s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

@keyframes mymove {
  0% {
    top: 40px;
    transform: scale(1.3, 1.3) rotate(15deg);
  }
  25% {
    top: 130px;
    transform: scale(1.3, 1.3) rotate(-5deg);
  }
  50% {
    top: 38px;
    transform: scale(1.3, 1.3) rotate(9deg);
  }
  75% {
    top: 100px;
    transform: scale(1.3, 1.3) rotate(3deg);
  }
  100% {
    top: 42px;
    transform: scale(1.3, 1.3) rotate(15deg);
  }
}
.head {
  transform: scale(1.3, 1.3);
  position: absolute;
  top: 40px;
  left: 320px;
  animation: mymove;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.61, 0.36, 0.26, 0.6);
}
</style>
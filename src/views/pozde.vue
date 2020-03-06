<template>
  <div>
    <v-btn @click="overlay = true" color="button" dark small fixed bottom right fab>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-overlay :value="overlay">
      <v-card
        :light="!$vuetify.theme.dark"
        style="margin: 10px; overflow-x: hidden; overflow-y: auto; max-height: 85vh"
      >
        <v-card-title>Zadej důvod pozdního příchodu</v-card-title>
        <v-card-text>
          <form onsubmit="event.preventDefault()">
            <v-select
              label="Vyučovací hodina"
              item-text="id"
              item-value="id"
              :items="selectItems"
              v-model="hodina"
            >
              <template v-slot:selection="data">
                <v-list-item-content style="flex: none !important">
                  <v-list-item-title>{{data.item.name}} - {{data.item.time}}</v-list-item-title>
                </v-list-item-content>
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title>{{data.item.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{data.item.time}}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-select>
            <v-textarea clearable v-model="duvod" placeholder="Zadej důvod" label="Důvod"></v-textarea>
            <v-btn dark block color="button" @click="takeTime">Vzít aktuální čas</v-btn>
            <v-time-picker :disabled="!timeCheck" use-seconds v-model="timeInput" format="24hr"></v-time-picker>
          </form>
        </v-card-text>
        <v-card-actions style="text-align: right; display: block">
          <v-btn text color="button" @click="overlay = false">Zrušit</v-btn>
          <v-btn text color="button" @click="odeslat">Poslat</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <v-card style="margin-bottom: 10px">
      <v-card-title>
        <h5>Pecuchovo záznamníček pozdních příchodů</h5>
      </v-card-title>
      <v-card-text>
        <v-list v-if="pozde.length > 0" two-line>
          <v-list-item-group>
            <v-list-item v-for="log in pozde" :key="log.id">
              <v-list-item-avatar>
                <h1 :style="{color: rozdil(log).rozdil > 0 ? 'red' : 'green'}">{{rozdil(log).string}}</h1>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title transition="fade-transition" v-text="log.reason"></v-list-item-title>
                <v-list-item-subtitle
                  class="text--primary"
                  v-text="timeFull(new Date(log.timestamp.seconds*1000))"
                ></v-list-item-subtitle>
                <v-list-item-subtitle
                  v-if="log.lesson"
                  class="text--primary"
                  v-text="`${log.lesson.name} - ${log.lesson.time}`"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="deleteDoc(log.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div v-else>
          <p>Není tu nic zapsáno...</p>
          <p>Buď se něco rozbilo, nebo začal chodit včas</p>
          <p>Ale moje osobní sázka je na rozbití 🦄</p>
        </div>
      </v-card-text>
    </v-card>
    <v-card style="margin-bottom: 10px">
      <v-card-title>Grafíci</v-card-title>
      <v-card-text style="padding-bottom: 0px">
        <chart :chart-data="{datasets: chart_data}" :width="null" :height="null"></chart>
      </v-card-text>
    </v-card>
  </div>
</template>
    
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import chart from "@/components/chartScatter";

export default {
  components: {
    chart: chart
  },
  data() {
    return {
      overlay: false,
      duvod: "",
      pozde: [],
      timeCheck: true,
      timeInput: null,
      selectItems: [
        { name: "0. hodina", time: "7:05", id: 0 },
        { name: "1. hodina", time: "8:00", id: 1 },
        { name: "2. hodina", time: "8:50", id: 2 },
        { name: "3. hodina", time: "9:45", id: 3 },
        { name: "4. hodina", time: "10:50", id: 4 },
        { name: "5. hodina", time: "11:40", id: 5 },
        { name: "6. hodina", time: "12:35", id: 6 },
        { name: "7. hodina", time: "13:25", id: 7 },
        { name: "8. hodina", time: "14:15", id: 8 },
        { name: "Seminář ČJ", time: "7:15", id: 9 }
      ],
      hodina: ""
    };
  },
  computed: {
    chart_data() {
      let self = this;
      let data = [];
      this.pozde.forEach((log, index) => {
        data.push({ y: self.rozdil(log).rozdil, x: this.pozde.length - index });
      });
      let array = [
        {
          label: "Pozdě",
          data: data,
          borderColor: "red",
          pointBackgroundColor: "red",
          pointBorderColor: "red",
          showLine: true
        }
      ];
      return array;
    }
  },
  methods: {
    async odeslat() {
      window.navigator.vibrate(500);
      let db = firebase.firestore();
      let timestamp;
      let d = new Date();
      let array = this.timeInput.split(":");
      d.setHours(array[0]);
      d.setMinutes(array[1]);
      d.setSeconds(array[2]);
      timestamp = firebase.firestore.Timestamp.fromDate(d);
      db.collection("pozde")
        .add({
          timestamp: timestamp,
          reason: this.duvod,
          lesson: this.selectItems[this.hodina]
        })
        .then(docRef => {});
      this.overlay = false;
      this.duvod = false;
    },
    deleteDoc(id) {
      let db = firebase.firestore();
      db.collection("pozde")
        .doc(id)
        .delete()
        .catch(foo => {
          console.log(foo);
          alert(
            "Nemůžeš deletovat! Musíš zaplatit odpustek svému bohu a ten ti možná odpustí tvé hříchy 😈😈😈👿👿👿👿👹👹👹👺👺👺"
          );
        });
    },
    timeFull(date) {
      let months = [
        "Leden",
        "Únor",
        "Březen",
        "Duben",
        "Květen",
        "Červen",
        "Červenec",
        "Srpen",
        "Září",
        "Říjen",
        "Listopad",
        "Prosinec"
      ];

      return `${date.getDate()}. ${
        months[date.getMonth()]
      } ${date.getFullYear()}  ${date.getHours()}:${(
        "0" + date.getMinutes()
      ).substr(-2)}:${("0" + date.getSeconds()).substr(-2)}`;
    },
    time(date) {
      return `${date.getHours()}:${("0" + date.getMinutes()).substr(-2)}`;
    },
    takeTime() {
      let d = new Date();
      this.timeInput = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    },
    rozdil(log) {
      let prichod = new Date(log.timestamp.seconds * 1000);
      let hodina = new Date(log.timestamp.seconds * 1000);
      let array = log.lesson.time.split(":");
      hodina.setHours(array[0]);
      hodina.setMinutes(array[1]);
      hodina.setSeconds(0);
      let rozdil = (prichod.getTime() - hodina.getTime()) / 1000;
      let string = `${Math.floor(Math.abs(rozdil) / 60)}:${(
        "0" +
        (Math.abs(rozdil) - 60 * Math.floor(Math.abs(rozdil) / 60))
      ).substr(-2)}`;
      return {string, rozdil};
    }
  },
  mounted() {
    let self = this;
    let db = firebase.firestore();
    db.collection("pozde")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshots => {
        self.pozde = [];
        snapshots.forEach(doc => {
          self.pozde.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
      });
  }
};
</script>

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
</style>
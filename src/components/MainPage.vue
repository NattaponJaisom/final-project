<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import "moment/dist/locale/th";
import moment from "moment";
import ChartComponent from "./ChartComponent.vue";

const data = ref();
const modal = ref(false);
const currentDay = ref();
const currentTemp = ref(0);
const listTime = ref();
const avgTemp = ref();

function date2Thai(srcDate, fullmonth = false, time = false) {
  if (srcDate == null || !moment(srcDate).isValid()) return "";

  const dateMoment = moment(srcDate);
  const day = dateMoment.format("DD");
  const month = dateMoment.format(fullmonth ? "MMMM" : "MMM");
  const year = +dateMoment.format("YYYY") + 543;
  return `${day} ${month} ${year}`;
}

async function getData() {
  const res = await axios.get(
    "https://limitedcocoa-default-rtdb.firebaseio.com/.json"
  );
  data.value = Object.entries(res.data).map((v) => ({
    date: new Date(v[0]).toDateString(),
    data: Object.entries(v[1]),
  }));

  currentDay.value = data.value[data.value.length - 1];
  const fulldayTemp = Object.entries(currentDay.value.data).map((v) => ({
    time: v[0],
    temp: v[1],
  }));
  currentTemp.value = fulldayTemp[fulldayTemp.length - 1].temp[1];
  return res.data;
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div class="text-h4 q-mb-lg q-ml-md text-white">
    หมักโกโก้ด้วยระบบสมองกลฝังตัว
  </div>
  <div class="flex justify-between">
    <q-card class="my-card flex items-center justify-center round">
      <div class="text-center">
        <div class="text-h4 q-mb-md">อุณหภูมิปัจจุบัน</div>
        <div class="text-h4">{{ currentTemp }} °C</div>
      </div>
    </q-card>
    <q-card class="my-graph flex items-center justify-center round">
      <ChartComponent />
    </q-card>
  </div>

  <q-list
    bordered
    separator
    class="q-mt-lg bg-white shadow-1 round scroll"
    style="max-height: 30vh"
  >
    <q-item
      v-for="(v, i) in data"
      class="q-py-none outlined"
      clickable
      @click="
        () => {
          modal = true;
          listTime = {
            date: date2Thai(i, true),
            data: Object.entries(v),
          };
          avgTemp = 0;
          listTime.data.forEach((v) => (avgTemp += v[1]));
          avgTemp = avgTemp / listTime.data.length;
        }
      "
      v-ripple
    >
      <q-item-section>{{ date2Thai(i, true) }}</q-item-section>
      <q-item-section avatar>
        <q-icon flat round color="grey" name="zoom_in" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-dialog v-model="modal">
    <q-card style="min-width: 80vw" class="round">
      <div
        class="row justify-between q-py-sm q-px-md"
        style="background-color: whitesmoke"
      >
        <div class="text-h6">
          <div>วันที่ {{ listTime.date }}</div>
          <div>อุณหภูมิเฉลี่ย {{ avgTemp.toFixed(1) }} °C</div>
        </div>
        <q-btn
          class="absolute-top-right q-ma-sm"
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </div>
      <q-list separator class="bg-white">
        <q-item class="row text-h6">
          <div class="col-6">เวลา</div>
          <div class="col-6">อุณหภูมิ</div>
        </q-item>
        <div class="scroll" style="height: 75vh">
          <q-item
            v-for="(v, i) in listTime.data"
            class="row flex items-center"
            :style="`${i % 2 === 0 ? 'background-color: whitesmoke' : ''}`"
          >
            <div class="col-6">{{ v[0] }}</div>
            <div class="col-6">{{ v[1] }} °C</div>
          </q-item>
        </div>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.my-card {
  min-height: 250px;
  width: 48%;
}

.my-graph {
  min-height: 250px;
  width: 48%;
}

.round {
  border-radius: 15px;
}

@media (max-width: 768px) {
  .my-card {
    width: 100%;
  }
  .my-graph {
    width: 100%;
    margin-top: 24px;
  }
}
</style>

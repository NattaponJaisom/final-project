<script setup lang="ts">
import Chart from "chart.js/auto";
import { onMounted, ref, onBeforeUnmount } from "vue";
import axios from "axios";
import "moment/dist/locale/th";
import moment from "moment";

const chartInstance = ref<Chart | null>(null);

const dataInfo = ref();
const dataInfoOption = ref();
const temp = ref<number[]>([]);
const time = ref<string[]>([]);
const randomColor = ref<string>();
const day = ref();

// const data = ref({
//   labels: time.value,
//   datasets: [
//     {
//       label: "อุณหภูมิ",
//       backgroundColor: "rgb(255, 99, 132)",
//       borderColor: "rgb(255, 99 ,132)",
//       data: temp.value,
//     },
//   ],
// });

const config = ref({
  type: "line" as const,
  data: {
    labels: time.value,
    datasets: [
      {
        label: "อุณหภูมิ",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99 ,132)",
        data: temp.value,
      },
    ],
  },
  options: {},
});

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360); // สุ่มค่า hue (เฉดสี) ระหว่าง 0-360
  const saturation = 70 + Math.random() * 30; // กำหนดค่า saturation ให้อยู่ในช่วง 70-100% เพื่อให้สีสด
  const lightness = 50 + Math.random() * 10; // กำหนดค่า lightness ให้อยู่ในช่วง 50-60% เพื่อให้สว่าง
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

async function getData() {
  const res = await axios.get(
    "https://limitedcocoa-default-rtdb.firebaseio.com/.json"
  );

  dataInfo.value = Object.entries(res.data).map((v) => ({
    date: new Date(v[0]).toDateString(),
    data: Object.entries(v[1]),
  }));
  dataInfo.value = dataInfo.value.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  dataInfoOption.value = dataInfo.value.map((v) => date2Thai(v.date, true));
  return res.data;
}

function date2Thai(srcDate, fullmonth = false, time = false) {
  if (srcDate == null || !moment(srcDate).isValid()) return "";

  const dateMoment = moment(srcDate);
  const day = dateMoment.format("DD");
  const month = dateMoment.format(fullmonth ? "MMMM" : "MMM");
  const year = +dateMoment.format("YYYY") + 543;
  return `${day} ${month} ${year}`;
}

function calGraph(selectedDay: string) {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  randomColor.value = getRandomColor();
  temp.value = [];
  time.value = [];
  dataInfo.value.forEach((v) => {
    if (date2Thai(v.date, true) === selectedDay) {
      v.data.forEach((x) => {
        temp.value.push(x[1]);
        time.value.push(x[0]);
      });
    }
  });

  day.value = selectedDay;

  const chartElement = document.getElementById(
    "myChart"
  ) as HTMLCanvasElement | null;
  if (chartElement) {
    config.value = {
      type: "line" as const,
      data: {
        labels: time.value,

        datasets: [
          {
            label: "อุณหภูมิ",
            backgroundColor: randomColor.value,
            borderColor: randomColor.value,
            // backgroundColor: "rgb(255, 99, 132)",
            // borderColor: "rgb(255, 99 ,132)",
            data: temp.value.concat([30, 40]),
          },
        ],
      },
      options: {},
    };

    chartInstance.value = new Chart(chartElement, config.value);
  }
}

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});

onMounted(async () => {
  await getData();
  if (dataInfo.value.length > 0) {
    day.value = dataInfoOption.value[dataInfoOption.value.length - 1];
    await calGraph(day.value);
  }
  //   const chartElement = document.getElementById(
  //     "myChart"
  //   ) as HTMLCanvasElement | null;
  //   if (chartElement) {
  //     const myChart = new Chart(chartElement, config);
  //   }
  // });
});
</script>

<template>
  <div class="card flex justify-end q-pa-md">
    <div>
      <q-select
        style="max-width: 200px"
        outlined
        v-model="day"
        :options="dataInfoOption"
        label="เลือกวันที่"
        dense
        @update:model-value="
          (v) => {
            calGraph(v);
          }
        "
      />
    </div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
}
</style>

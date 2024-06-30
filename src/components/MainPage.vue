<script setup>
import { ref } from "vue";

import "moment/dist/locale/th";
import moment from "moment";

const isOn = ref(false);

const columns = [
  {
    name: "no",
    required: true,
    label: "ลำดับ",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "ชื่อ",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "dateStart",
    align: "left",
    label: "วัน/เดือน/ปีที่เริ่ม",
    field: (row) => row.dateStart,
    format(val) {
      return date2Thai(val);
    },
    sortable: true,
  },
  {
    name: "dateEnd",
    align: "left",
    label: "วัน/เดือน/ปีที่จบ",
    field: "dateEnd",
    sortable: true,
  },
  {
    name: "detail",
    align: "center",
    label: "ดูรายละเอียด",
    field: "detail",
    sortable: true,
  },
];

const rows = [
  {
    name: "test",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test4",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test5",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test6",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test5",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test6",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test5",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
  {
    name: "test6",
    dateStart: new Date(),
    dateEnd: new Date(),
  },
];

function date2Thai(srcDate) {
  if (srcDate == null || !moment(srcDate).isValid()) return "";

  const dateMoment = moment(srcDate);
  const day = dateMoment.format("DD");
  const month = dateMoment.format("MMM");
  const year = +dateMoment.format("YYYY") + 543;
  return `${day} ${month} ${year}`;
}
</script>

<template>
  <div class="text-h2 q-mb-lg q-ml-md">เครื่องมหาเทพ</div>
  <div class="row full-width q-gutter-lg">
    <q-card class="my-card col flex items-center justify-center">
      <div class="text-center">
        <h3>Complete Project</h3>
        <h3>7</h3>
      </div>
    </q-card>
    <q-card class="my-card col flex items-center justify-center">
      <div class="text-center">
        <h3>Current Temp</h3>
        <h3>37.5 °C</h3>
      </div>
    </q-card>
    <div class="my-card col row items-center justify-center">
      <div class="q-mr-md text-h6">Status :</div>
      <div class="flex justify-center items-center text-subtitle1">
        Off
        <q-toggle v-model="isOn" class="q-mr-sm" />
        On
      </div>
    </div>
  </div>

  <div class="q-pa-lg q-mt-lg">
    <q-table title="ตารางเทพ" :rows="rows" :columns="columns" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'no'">{{ props.rowIndex + 1 }}</div>
            <div v-else-if="col.name === 'dateStart'">
              {{ date2Thai(props.row.dateStart) }}
            </div>
            <div v-else-if="col.name === 'dateEnd'">
              {{ date2Thai(props.row.dateEnd) }}
            </div>
            <div v-else-if="col.name === 'detail'">
              <q-btn flat round color="grey" icon="zoom_in" />
            </div>
            <div v-else>
              {{ props.row.name }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>
.my-card {
  min-height: 300px;
}
</style>

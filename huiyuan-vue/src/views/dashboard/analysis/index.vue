<template>
  <ele-page>
    <statistics-card />
    <sale-card />
    <el-row :gutter="16">
      <el-col :span="16">
        <visit-hour />
      </el-col>
      <el-col :span="8">
        <hot-search />
      </el-col>
    </el-row>
  </ele-page>
</template>

<script setup>
  import StatisticsCard from './components/statistics-card.vue';
  import SaleCard from './components/sale-card.vue';
  import VisitHour from './components/visit-hour.vue';
  import HotSearch from './components/hot-search.vue';
</script>

<script>
  export default {
    name: 'DashboardAnalysis'
  };
</script>

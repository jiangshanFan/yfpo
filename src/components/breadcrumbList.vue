<template>
  <div class="breadcrumbList">
    <el-breadcrumb class="lh40 bg_f5" separator="/">
      <transition-group name="breadcrumb">
        <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
        <el-breadcrumb-item :class="{'is-last-link':i===breadcrumbList.length-1}" v-for="(val,i) in breadcrumbList" :key="val.id"
                            :to="i===0?'':{path:val.path}" @click.native="showDefault(val.thing)" v-if="!val.auth">
          {{val.name}}
        </el-breadcrumb-item>

      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "breadcrumbList",
    props: {
      breadcrumbList: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    methods: {
      showDefault(val) {
        this.$emit('showDefault',val);
      },
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped>

</style>

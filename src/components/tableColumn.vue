<template>
  <div>
    <template v-for="h in header">
      <el-table-column
        v-if="!h.children"
        :fixed="h.fixed"
        :key="h.prop"
        :label="h.label"
        :prop="h.prop"
        :sortable= "h.sortable"
        :width="h.width !=='unset' ?h.eachWidth? h.label.length*h.eachWidth: h.label.length*25 : ''"
        :min-width="h.minWidth"
        align="center"
        :show-overflow-tooltip="!h.tooltip">
        <!--
          the method of using:
            one： 'change', type: Array, is suitable for the different status(['','nice'])
            two: 'parent', type: String, is suitable for the prop in an object(parent.prop)
            three: 'multiProp', type: Array, is suitable for the several prop in the same node and divide by '、'(['',''])
            four: 'division', type: Number, is suitable for the division between different number
            five: 'select', type: Array, is suitable for the selection of different option([ { id: 0, label: '否'}, { id: 1, label: '是'},])
            six: 'children', type: Array, is suitable for the multistage header([{ prop: 'janTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'janMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },])
        -->
        <template slot-scope="scope">
          <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
          <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
          <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
          <span v-else-if="h.division">{{scope.row[h.prop] / h.division}}</span>
          <el-select v-else-if="h.select" v-model="scope.row[h.prop]" ref="selectProp" placeholder="请选择" size="mini" @change="changeStatus(scope.row)" :disabled="!h.disabled"> <!-- v-model的值与：value值一致，显示值为label值 -->
            <el-option v-for="item in h.select" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
          <p v-else-if="h.pre" v-html="scope.row[h.prop]" style="white-space: normal"></p>
          <span v-else>{{scope.row[h.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-else :key="h.prop" :label="h.label" align="center" show-overflow-tooltip>
        <tableColumn :header="h.children"></tableColumn>
      </el-table-column>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "tableColumn",
    mounted() {

    },
    updated() {
      console.log(this.header)
    },
    methods: {
      changeStatus(obj) {
        this.$emit('changeStatus', obj);
      },
    },
    data() {
      return {
        pre: [],
      }
    },
    props: {
      header: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>

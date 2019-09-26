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
        :width="h.width !=='unset' ?h.eachWidth? h.label.length*h.eachWidth: h.width? h.width: h.label.length*25 : ''"
        :min-width="h.minWidth"
        align="center"
        :show-overflow-tooltip="!h.tooltip">
        <!--
          the method of using:
            one： 'change', type: Array, is suitable for the different status(['','nice'])
            two: 'parent', type: String, is suitable for the prop in an object(parent.prop)
            three: 'multiProp', type: Array, is suitable for the several prop in the same node and divide by '、'(['',''])
            four: 'division', type: Number, is suitable for the division between different number
            five: 'select', type: Array, is suitable for the selection of different option([ { id: 0, label: '否'}, { id: 1, label: '是'},]),——if v-model is object, must add value-key & modified the options's value
            six: 'children', type: Array, is suitable for the multistage header([{ prop: 'janTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'janMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },])
        -->
        <template slot-scope="scope">
          <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>

          <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>

          <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->

          <span v-else-if="h.division">{{scope.row[h.prop] / h.division}}</span>

          <p v-else-if="h.selectOrSpan">  <!-- yfpo mouldList -->
            <span v-if="scope.row.status !== 1 && h.childProp">{{scope.row[h.prop]?scope.row[h.prop].name:scope.row[h.prop]}}</span>
            <el-select v-else v-model="scope.row[h.prop]" :value-key="h.childProp" ref="selectProp" placeholder="请选择" size="mini" @change="changeStatus(scope.row, h.prop)" :disabled="!h.disabled"> <!-- v-model的值与：value值一致，显示值为label值 -->
              <el-option v-for="item in h.selectOrSpan" :key="item.id" :label="item.label" :value="h.childProp?item:item.id"></el-option>
            </el-select>
          </p>

          <el-select v-else-if="h.select" v-model="scope.row[h.prop]" :value-key="h.childProp" ref="selectProp" placeholder="请选择" size="mini" @change="changeStatus(scope.row, h.prop)" :disabled="!h.disabled"> <!--v-model的值与：value值一致，显示值为label值-->
            <el-option v-for="item in h.select" :key="item.id" :label="item.label" :value="h.childProp?item:item.id"></el-option>
          </el-select>

          <p v-else-if="h.pre" v-html="scope.row[h.prop]" style="white-space: normal"></p>

          <span v-else-if="h.button"><el-button class="underline f12" type="text" align="center" @click="edits(scope.row, h.button.key)">{{h.button.value}}</el-button></span>

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
      changeStatus(obj, prop) {
        this.$emit('changeStatus', obj, prop);
      },

      edits(row, key) {
        this.$emit('edits', {row: row, key: key});
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
  p {
    margin: 0 !important;
  }
</style>

<template>
  <div class="detailListEdit_Edit_detail">
    <div class="title mb20">
      <span><b>检查内容：</b></span>
      <p v-html="allInfo.checkContent"></p>
    </div>

    <!-- list -->
    <el-row class="pl20 pr20 boxShadow_head">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item v-for="(item, index) in list" :key="index" :name="index">
          <template slot="title">
            <span class="mr20"><b>{{item.role === 1? 'Basis': '延峰彼欧'}}</b></span>
            <span class="mr20"><b>{{item.name}}</b></span>
            <span class="mr20"><b>{{item.createTime}}</b></span>
          </template>
          <el-row class="pl20 pr20">
            <p>{{item.remark}}</p>
            <el-col class="ovwh" :span="6" v-for="(img,ind) in item.imageUrl" :key="ind">
              <img class="w100" :src="img" alt="图片" />
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>

    <!-- add -->
    <el-row class="mt20">
      <p>新增描述：</p>
      <el-input
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="请输入内容"
        v-model="remark">
      </el-input>

      <!-- 上传图片或者文件 -->
      <div class="add-upload mt20 mb20">
        <el-upload
          action="/api/upload/file/uploadManyFile"
          accept="image/*"
          list-type="picture-card" multiple
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :data="uploadData"
          :file-list="fileList">
          <i class="el-icon-plus"><div slot="tip" class="el-upload__tip">添加图片</div></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="imgeUrl" alt="">
        </el-dialog>
      </div>

      <el-button type="primary" size="small" @click="saveInfos">提交</el-button>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { getCheckDetailList, addCheckDetail, } from '../axios/api.js'
export default {
  name: "detailListEdit_Edit_detail",
  created() {
    this.allInfo = this.$store.getters.details;
    this.getList();
  },
  methods: {
    // get list
    async getList() {
      // console.log(this.activeName)
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.details.serialNo,
      };

      let res = await getCheckDetailList(params);

      if(res.status === 1) {
        this.list = JSON.parse(JSON.stringify(res.msg));
        if (this.list) {
          //图片
          this.list.forEach(item => {
            let imgeUrl = item.imageUrl;
            if(imgeUrl !== undefined && imgeUrl !== null) {
              if(imgeUrl.length > 1 && imgeUrl.charAt(imgeUrl.length - 1) === '|') { /** 需要先判断imgeUrl ！== null，才能获取length */
              item.imageUrl = imgeUrl.substr(0,imgeUrl.length - 1).split('|');
              }else {
                item.imageUrl = imgeUrl.split('|');
              }
            }
          });
        }
      }
    },

    handleChange(val) {
      // console.log(val);
    },

    handleAvatarSuccess(res, file) {//图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + '|';
    },

    handleRemove(file, fileList) {
      this.fileToImg(fileList);
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.imgeUrl = file.url;
      this.dialogVisible = true;
    },
    //转换 fileList 到拼接 字符串类型 imgUrl, | 连接
    fileToImg (val) {
      for (let item of val) {
        this.imgUrl += item.url + '|';
      }
    },

    // save infos
    async saveInfos() {
      let params = {
        imageUrl: this.imgUrl,
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.details.serialNo,
        remark: this.remark,
      };
      let res = await addCheckDetail(params);
      if (res.status === 1) {
        Message({showClose: true, type: 'success', message: '新增描述成功！'});
        this.getList();
        this.remark = '';
        this.imgUrl = '';
        this.fileList = [];
        this.activeNames = 0;
      }
    },
  },
  data() {
    return {
      allInfo: '',
      activeNames: 0,
      list: [],
      remark: '',
      dialogVisible: false,
      imgeUrl: '',
      imageUrl: '',
      fileList: [],
      uploadData: {path: 'detail_pc'}, //上传时需要传递的额外参数
    }
  },
}
</script>

<style scoped>

</style>

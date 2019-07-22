<template>
  <div class="designList_Edit_detail">
    <div class="title mb20">
      <span><b>评审内容：</b></span>
      <p v-html="allInfo.verification"></p>
    </div>

    <el-divider></el-divider>

    <el-row class="mb20">
      <el-col>
        <span><b>INFORMATION/REMARKS/ACTION:</b></span>
        <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="allInfo.remarks" maxlength="100" resize="none"></el-input>
      </el-col>
    </el-row>

    <!-- add -->
    <el-row class="boxShadow mb20">
      <!-- 评审标准 -->
      <el-row class="mt20">
        <p class="fwb">评审标准：</p>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3}"
          placeholder="请输入内容"
          v-model="allInfo.assessDescribe">
        </el-input>

        <!-- list -->
        <el-row :gutter="20">
          <el-col class="ovwh mt20" :span="6" v-for="(img,ind) in allInfo.assessImage" :key="ind">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;">
              <img class="uploadImg" :src="img" alt="图片" />
              <span class="delete" @click="deleteImg(ind,'assessImage')"></span>
            </el-col>
          </el-col>

          <el-col class="ovwh mt20" :span="6" v-for="(type,index) in assessImage" :key="type+index">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;" v-loading="assessImageLoading"></el-col>
          </el-col>

          <el-col :span="6">
            <!-- 上传图片或者文件 -->
            <div class="ovwh add-upload mt20 mb20">
              <el-upload
                action="/api/upload/file/uploadManyFile"
                accept="image/*"
                multiple
                :show-file-list="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleAssessAvatarSuccess"
                :before-upload="handleAssessBeforeUpload"
                :data="uploadData"
                :file-list="fileList">
                <p class="w100 imgContainer tc"><img class="uploadLogo" src="../assets/upload_logo.png" alt="上传" /></p>
              </el-upload>
            </div>
          </el-col>
        </el-row>

        <el-divider></el-divider>
      </el-row>

      <!-- 模具现状 -->
      <el-row class="mt20">
        <p class="fwb">模具现状：</p>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3}"
          placeholder="请输入内容"
          v-model="allInfo.presentSituationDescribe">
        </el-input>

        <!-- list -->
        <el-row :gutter="20">
          <el-col class="ovwh mt20" :span="6" v-for="(img,ind) in allInfo.presentSituationImage" :key="ind">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;">
              <img class="uploadImg" :src="img" alt="图片" />
              <span class="delete" @click="deleteImg(ind,'presentSituationImage')"></span>
            </el-col>
          </el-col>

          <el-col class="ovwh mt20" :span="6" v-for="(type,index) in presentSituationImage" :key="type+index">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;" v-loading="presentSituationImageLoading"></el-col>
          </el-col>

          <el-col :span="6">
            <!-- 上传图片或者文件 -->
            <div class="ovwh add-upload mt20 mb20">
              <el-upload
                action="/api/upload/file/uploadManyFile"
                accept="image/*"
                multiple
                :show-file-list="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handlePresentSituationAvatarSuccess"
                :before-upload="handlePresentSituationBeforeUpload"
                :data="uploadData"
                :file-list="fileList">
                <p class="w100 imgContainer tc"><img class="uploadLogo" src="../assets/upload_logo.png" alt="上传" /></p>
              </el-upload>
              <!--<el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="imgeUrl" alt="">
              </el-dialog>-->
            </div>
          </el-col>
        </el-row>

        <el-divider></el-divider>
      </el-row>

      <!-- 改善后 -->
      <el-row class="mt20">
        <p class="fwb">改善后：</p>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3}"
          placeholder="请输入内容"
          v-model="allInfo.improveDescribe">
        </el-input>

        <!-- list -->
        <el-row :gutter="20">
          <el-col class="ovwh mt20" :span="6" v-for="(img,ind) in allInfo.improveImage" :key="ind">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;">
              <img class="uploadImg" :src="img" alt="图片" />
              <span class="delete" @click="deleteImg(ind,'improveImage')"></span>
            </el-col>
          </el-col>

          <el-col class="ovwh mt20" :span="6" v-for="(type,index) in improveImage" :key="type+index">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;" v-loading="improveImageLoading"></el-col>
          </el-col>
          <!-- 上传图片或者文件 -->
          <el-col :span="6">
            <div class="w100 ovwh add-upload mt20 mb20">
              <el-upload
                action="/api/upload/file/uploadManyFile"
                accept="image/*"
                multiple
                :show-file-list="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleImproveAvatarSuccess"
                :before-upload="handleImproveBeforeUpload"
                :data="uploadData"
                :file-list="fileList">
                <p class="w100 imgContainer tc"><img class="uploadLogo" src="../assets/upload_logo.png" alt="上传" /></p>
              </el-upload>
              <!--<el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="imgeUrl" alt="">
              </el-dialog>-->
            </div>
          </el-col>

        </el-row>

        <el-divider></el-divider>
      </el-row>
    </el-row>

    <el-row class="tc">
      <el-button type="primary" size="small" @click="saveInfos">提交</el-button>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { updateDesignInfo } from '../axios/api.js'
export default {
  name: "designList_Edit_detail",
  created() {
    this.allInfo = this.$store.getters.design_details;
    //test
    // this.imgUrl = this.allInfo.assessImage? this.allInfo.assessImage : '';

    this.getList();
  },
  methods: {
    // transfer string to img array
    StringToImg(val) {
      if (this.allInfo[val]) {
        let imgeUrl = this.allInfo[val];
        if(imgeUrl !== undefined && imgeUrl !== null && imgeUrl) {
          if(imgeUrl.length > 1 && imgeUrl.charAt(imgeUrl.length - 1) === '|') { /** 需要先判断imgeUrl ！== null，才能获取length */  /*test:.map((item,index) => {return {url: item.url, name: index} })*/
          this.allInfo[val] = imgeUrl.substr(0,imgeUrl.length - 1).split('|');
          }else {
            this.allInfo[val] = imgeUrl.split('|');
          }
        } else {
          this.allInfo[val] = [];
        }
      } else {
        this.allInfo[val] = [];
      }
      // console.log(this.allInfo[val]);
    },

    // get list
    async getList() {
      this.StringToImg('assessImage');
      this.StringToImg('presentSituationImage');
      this.StringToImg('improveImage');
      // this.fileList = [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    },

    handleChange(val) {
      // console.log(val);
    },

    handleAssessBeforeUpload(file) {
      this.assessImageLoading = true;
      this.assessImage.push('assessImage');
      // console.log(file);
      // const reader = new FileReader();
      // let p = new Promise((resolve, reject) => {
      //   reader.onload = e => { resolve(reader) };
      //   reader.onerror = e => { reject(e) }
      // });
      //
      // reader.readAsDataURL(file);
      // // console.log(reader);
      // p.then((respose) => {
      //   console.log(respose);
      //   this.allInfo.assessImage.push(respose.result);
      // })
    },

    handleAssessAvatarSuccess(res, file) {//图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + '|';  // 存储上传成功后的图片地址
      this.allInfo.assessImage.push(img);
      this.assessImage.pop();

      if (this.assessImage.length === 0) {
        this.assessImageLoading = false;
      }
    },

    handlePresentSituationBeforeUpload(file) {
      this.presentSituationImageLoading = true;
      // console.log(file);
      this.presentSituationImage.push('presentSituationImageLoading');
      // console.log(this.improveImage);
    },

    handlePresentSituationAvatarSuccess(res, file) {//图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + '|';  // 存储上传成功后的图片地址
      this.allInfo.presentSituationImage.push(img);
      this.presentSituationImage.pop();

      if (this.presentSituationImage.length === 0) {
        this.presentSituationImageLoading = false;
      }
    },

    handleImproveBeforeUpload(file) {
      this.improveImageLoading = true;
      // console.log(file);
      this.improveImage.push('improveImageLoading');
      // console.log(this.improveImage);
    },

    handleImproveAvatarSuccess(res, file) {//图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + '|';  // 存储上传成功后的图片地址
      this.allInfo.improveImage.push(img);
      this.improveImage.pop();

      if (this.improveImage.length === 0) {
        this.improveImageLoading = false;
      }
    },

    deleteImg(key, obj) {
      this.allInfo[obj].splice(key,1);
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
      for (let item of this.allInfo[val]) {
        this.allInfo[val] += item + '|';
      }
    },

    // save infos
    async saveInfos() {
      let allInfo = JSON.parse(JSON.stringify(this.allInfo));
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        reviewList: [
          {
            ...allInfo,
            assessImage: allInfo.assessImage.join('|'),
            presentSituationImage: allInfo.presentSituationImage.join('|'),
            improveImage: allInfo.improveImage.join('|'),
          },
        ],
      };
      let res = await updateDesignInfo(params);
      if (res.status === 1) {
        Message({showClose: true, type: 'success', message: '新增描述成功！'});
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
      uploadData: {path: 'design_pc'}, //上传时需要传递的额外参数
      imgUrl: '',

      assessImageLoading: true,
      presentSituationImageLoading: true,
      improveImageLoading: true,
      assessImage: [],
      presentSituationImage: [],
      improveImage: [],

    }
  },
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .designList_Edit_detail {
    width: 100%;
    margin: 0 auto;
    .imgContainer {
      height: 100px;
      .uploadLogo {
        width: 100px;
        height: 100px;
      }
      .uploadImg {
        width: 100px;
        height: 100px;
      }
    }
  }
}

@media screen and (max-width: 1279px) and (min-width: 961px) {
  .designList_Edit_detail {
    width: 90%;
    margin: 0 auto;
    .imgContainer {
      height: 150px;
      .uploadLogo {
        width: 150px;
        height: 150px;
      }
      .uploadImg {
        width: 150px;
        height: 150px;
      }
    }
  }
}

@media screen and (min-width: 1280px) {
  .designList_Edit_detail {
    width: 80%;
    margin: 0 auto;
    .imgContainer {
      height: 200px;
      .uploadLogo {
        width: 200px;
        height: 200px;
      }
      .uploadImg {
        width: 200px;
        height: 200px;
      }
      .delete {
        display: none;
      }
    }
    .imgContainer:hover {
      .delete {
        display: block;
      }
    }
  }
}

.imgContainer {
  position: relative;
  margin: 0;
  overflow: hidden;
  .delete {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    overflow: hidden;
    /*overflow: hidden;*/
    &:before {
      content: '×';
      top: 0;
      right: 0;
      font-size: 50px;
      position: absolute;
      cursor: pointer;
      color: #fff;
      background-color: #ccc;
    }
  }
}

</style>

<template>
  <div class="detailListEdit_Edit_detail">
    <div class="title mb20">
      <span>
        <b>检查内容：</b>
      </span>
      <p v-html="allInfo.checkContent"></p>
    </div>
    <!-- 新增内容附件 -->
    <el-row class="mb20">
      <el-col>
        <el-col style="margin-top:40px;">
          <span>
            <i class="sideBar"></i>
            <b>内容附件</b>
          </span>
          <span>
            <el-upload
              class="upload-demo"
              style="display: inline; margin-left:16px;"
              action="/api/upload/file/uploadManyEnclosure"
              :on-preview="uploadList"
              :on-success="uploadSuccess"
              :on-remove="deleteList"
              :on-progress="loadIng"
              :data="dataObj"
              name="files"
              multiple
              :file-list="fileTable"
              :before-upload="beforeUpload"
            >
              <el-button size="mini" type="primary">添加</el-button>
            </el-upload>
          </span>
        </el-col>
        <!-- 下载展示区域 -->
        <el-col>
          <div>
            <div class="dowmLoad" style="overflow:auto; margin-top:10px;">
              <ul class="downloadList">
                <li v-for="(item,index) in fileDataLeft" :key="index">
                  <span>{{item.filename}}</span>
                  <span style="margin-left:20px;">
                    <!-- <a class="imga" :href="item.url" :download="item.filename"></a> -->
                    <a @click="adownloadleft(item.url)" class="imga"></a>
                    <img src="../assets/deletefile.png" alt @click="deleteLeft(item.id)" />
                  </span>
                  <el-dialog
                    title="提示"
                    :visible.sync="dialogVisibleForDownload"
                    width="20%"
                    :center="true"
                  >
                    <span style="margin-left:39%">确认下载吗？</span>
                    <span slot="footer" class="dialog-footer">
                      <a
                        class="btnStyle"
                        @click="dialogVisibleForDownload = false"
                        :href="firstdownloadleft"
                        download
                      >确 定</a>
                      <el-button
                        size="mini"
                        style="text-align:center;"
                        @click="dialogVisibleForDownload = false"
                      >取 消</el-button>
                    </span>
                  </el-dialog>
                </li>
              </ul>
              <ul class="downLoadTwoList">
                <li v-for="(item,index) in fileDataRight" :key="index">
                  <span>{{item.filename}}</span>
                  <span style="margin-left:20px;">
                    <!-- <a class="imga" :href="item.url" :download="item.filename"></a> -->
                    <a
                      @click="bdownloadright(item.url)"
                      class="imga"
                    ></a>
                    <img src="../assets/deletefile.png" alt @click="deleteRight(item.id)" />
                  </span>
                  <el-dialog
                    title="提示"
                    :visible.sync="dialogVisibleForDownloadRight"
                    width="20%"
                    :center="true"
                  >
                    <span style="margin-left:39%">确认下载吗？</span>
                    <span slot="footer" class="dialog-footer">
                      <a
                        class="btnStyle"
                        @click="dialogVisibleForDownloadRight = false"
                        :href="seconddownloadright"
                        download
                      >确 定</a>
                      <el-button
                        size="mini"
                        style="text-align:center;"
                        @click="dialogVisibleForDownloadRight = false"
                      >取 消</el-button>
                    </span>
                  </el-dialog>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-col>
    </el-row>
    <!-- list -->
    <el-row class="pl20 pr20 boxShadow_head">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item v-for="(item, index) in list" :key="index" :name="index">
          <template slot="title">
            <p style="border-bottom: 1px solid #ccc;">
              <span class="mr20">
                <b>{{item.role === 1? 'Basis': '延峰彼欧'}}</b>
              </span>
              <span class="mr20 c3">{{item.name}}</span>
              <span class="mr20 cc f12">
                <b>{{item.createTime}}</b>
              </span>
            </p>
          </template>
          <el-row class="w100 ovwh pl20 pr20">
            <div>
              <p class="w100 underline word_break">{{item.remark}}</p>
              <el-row :gutter="20" v-if="item.imageUrl.length !== 0">
                <el-col
                  class="ovwh mt20 showBox"
                  :span="12"
                  v-for="(img,ind) in item.imageUrl"
                  :key="ind"
                >
                  <div class="border" style="display:flex">
                    <!-- <img class="w100" :src="img" alt="图片" style="max-height:200px;width:auto;" /> -->
                    <el-image
                      :src="img"
                      alt="图片"
                      :preview-src-list="item.imageUrl"
                      style="height:200px; width:200px; display:inline-block; flex:1;"
                      fit="fill"
                    >
                      <div slot="placeholder" class="image-slot stressing">
                        <i class="el-icon-loading"></i>
                        加载中
                        <span class="dot">...</span>
                      </div>
                    </el-image>
                    <div class="imgSstyle">
                      <p>图片说明：</p>
                      <pre style="white-space:pre-wrap;">{{item.imageDescribe?item.imageDescribe.split("|")[ind]:''}}</pre>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- add -->
    <el-row class="mt20">
      <i class="sideBar"></i>
      <b>新增描述：</b>
      <el-input
        style="margin-top:20px;"
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="请输入内容"
        resize="none"
        v-model="remark"
      ></el-input>

      <!-- 上传图片或者文件 -->
      <div class="add-upload mt20 mb20">
        <div
          class="showImgDiv"
          style="height:138px;"
          v-for="item1 in pictureName"
          :key="item1.name"
          v-loading="loading"
        ></div>
        <div v-for="(item,index) in imgList" :key="index" class="showStyle">
          <div class="showImgDiv imgContainer">
            <img class="showImgStyle" :src="item" alt />
            <span class="delete" @click="deleteImge(item)"></span>
          </div>
          <el-input
            type="textarea"
            class="inputStyle"
            :rows="6"
            placeholder="请输入内容"
            resize="none"
            v-model="inputValue[item]"
          ></el-input>
        </div>
        <el-upload
          action="/api/upload/file/uploadManyFile"
          accept="image/*"
          multiple
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :on-progress="handleProgress"
          :data="uploadData"
          :file-list="fileList"
          :show-file-list="false"
          :before-upload="callBackBefore"
        >
          <div class="upStyle">
            <i class="el-icon-plus">
              <div slot="tip" class="el-upload__tip">添加图片</div>
            </i>
          </div>
          <!-- <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}" style="display:flex;">
            <div class="upImgStyle">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            </div>
            <div style="flex:6;">
              <el-input
              class="elInput"
              type="textarea"
              :ref="file.name"
              :rows="6"
              placeholder="请输入内容"
              resize="none"
              v-model="inputValue[file.name]"
            ></el-input>
            </div>
          </div>-->
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="imgeUrl" alt />
        </el-dialog>
      </div>

      <el-button
        type="primary"
        size="small"
        @click="saveInfos"
        :disabled="!uploadWork && !remark"
      >提交</el-button>
      <!-- 新增保存按钮 -->
      <el-button size="small" style="margin-left:25px;" type="primary" @click="saveCheck">保存</el-button>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  getCheckDetailList,
  addCheckDetail,
  saveCheckDetail,
  getCheckDetail,
  getEnclosureList,
  deleteEnclosure
} from "../axios/api.js";
export default {
  name: "detailListEdit_Edit_detail",
  created() {
    this.allInfo = this.$store.getters.details;
    this.getList();
    this.getDetail();
  },
  mounted() {
    this.getEnclosure();
    let rse = window.location;
    this.downloadUrl = rse.origin;
  },
  methods: {
    // 左边下载地址
    adownloadleft(url){
      this.firstdownloadleft=url
      this.dialogVisibleForDownload=true
    },
    // 右边弹窗下载
    bdownloadright(url){
      this.seconddownloadright=url
      this.dialogVisibleForDownloadRight=true
    },
    //删除上传列表图片
    deleteImge(item) {
      this.imgUrl = [];
      for (let i = 0; i < this.imgList.length; i++) {
        if (item === this.imgList[i]) {
          this.imgList.splice(i, 1);
          this.imgList.forEach(item => {
            this.imgUrl.push(item);
          });
        }
      }
    },
    // 上传图片鼠标移入事件
    // enter(index) {
    //   this.isActive = index;
    // },
    // moveout() {
    //   this.isActive = null;
    // },
    //照片备注处理
    upImgRemarks() {
      let obj = JSON.parse(JSON.stringify(this.inputValue));
      this.inputValue = {};
      this.imgList.forEach(item => {
        if (Object.keys(obj).indexOf(item) === -1) {
          this.inputValue[item] = " ";
        } else {
          this.inputValue[item] = obj[item];
        }
      });
      let arr = [];
      for (let [key, value] of Object.entries(this.inputValue)) {
        arr.push(value);
      }
      this.upImgData = arr.join("|");
    },
    //删除附件
    async deleteLeft(id) {
      let res = await deleteEnclosure({
        id: id
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "删除成功",
          center: true
        });
        this.fileDataRight = [];
        this.fileDataLeft = [];
        this.fileDownLoadData = [];
        this.getEnclosure();
      }
    },
    async deleteRight(id) {
      let res = await deleteEnclosure({
        id: id
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "删除成功",
          center: true
        });
        this.fileDataRight = [];
        this.fileDataLeft = [];
        this.fileDownLoadData = [];
        this.getEnclosure();
      }
    },
    //保存详情
    async saveCheck() {
      this.upImgRemarks();
      if (
        !this.messageShow ||
        this.remark !== "" ||
        this.imgList.length !== 0
      ) {
        let image = this.imgList.join("|");
        let res = await saveCheckDetail({
          id: this.id,
          imageUrl: image,
          mouldNo: this.$store.getters.mould_list.mouldNo,
          remark: this.remark,
          smallClass: this.allInfo.serialNo,
          imageDescribe: this.upImgData
        });
        if (res.status === 1) {
          if (this.messageShow) {
            this.$message({
              type: "success",
              message: "保存成功",
              center: true
            });
          } else {
            this.fileList = [];
            this.imgList = [];
            this.remark = "";
            this.messageShow = true;
          }
          // console.log(this.allInfo);
        }
      } else {
        this.$message({
          type: "warning",
          message: "请输入之后保存",
          center: true
        });
      }
    },
    async getDetail() {
      //获取详情草稿
      let data = await getCheckDetail({
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.allInfo.serialNo
      });
      if (data.status === 1 && data.msg !== null) {
        this.str = true;
        this.id = data.msg.id;
        this.remark = data.msg.remark;
        if (data.msg.imageUrl == "") {
          return;
        } else {
          this.url = data.msg.imageUrl.split("|");
          let arr = [];
          if (data.msg.imageDescribe) {
            arr = data.msg.imageDescribe.split("|");
          }
          let obj = {};
          for (let i = 0; i < this.url.length; i++) {
            this.fileList.push({ url: this.url[i] });
            this.imgList.push(this.url[i]);
            obj[this.url[i]] = arr[i];
            this.imgUrl.push(this.url[i]);
          }
          this.inputValue = Object.assign({}, obj);
        }
      }
      if (!this.messageShow) {
        this.fileList = [];
        this.imgList = [];
        this.remark = "";
        this.imgUrl = [];
        this.saveCheck();
      }
    },
    //获取下载地址
    async getEnclosure() {
      let res = await getEnclosureList({
        mouldNo: this.$store.getters.mould_list.mouldNo,
        classId: this.$store.getters.details.serialNo,
        type: 1
      });
      if (res.status === 1) {
        this.fileDataRight = [];
        this.fileDataLeft = [];
        this.fileDownLoadData = [];
        res.msg.forEach(item => {
          let download =
            this.downloadUrl +
            item.url +
            `?filename=${item.fileName.replace(/[&,\\#]/g, "")}`;
          this.fileDownLoadData.push({
            url: download,
            filename: item.fileName,
            id: item.id
          });
        });
        for (let i = 0; i < this.fileDownLoadData.length; i++) {
          if (i % 2 == 0) {
            this.fileDataLeft.push(this.fileDownLoadData[i]);
          } else {
            this.fileDataRight.push(this.fileDownLoadData[i]);
          }
        }
      }
    },
    // get list
    async getList() {
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.$store.getters.details.serialNo
      };

      let res = await getCheckDetailList(params);

      if (res.status === 1) {
        this.list = JSON.parse(JSON.stringify(res.msg));
        if (this.list) {
          //图片
          this.list.forEach(item => {
            let imgeUrl = item.imageUrl;
            if (imgeUrl !== undefined && imgeUrl !== null && imgeUrl) {
              if (imgeUrl.length > 1) {
                /** 需要先判断imgeUrl ！== null，才能获取length */
                item.imageUrl = imgeUrl.split("|");
              } else {
                item.imageUrl = imgeUrl.split("");
              }
            } else {
              item.imageUrl = [];
            }
          });
        }
      }
    },

    //多附件上传区域
    //点击文件列表中已上传的文件时的钩子
    uploadList(file) {},
    //文件上传成功钩子
    uploadSuccess(res, file, fileTable) {
      this.getEnclosure();
      let index = fileTable.indexOf(file);
      if (index > -1) {
        // clear fileTable after upload
        return fileTable.splice(index, 1);
      }
    },
    beforeUpload(file) {},
    //文件列表移除文件时的钩子
    deleteList(res, file, fileTable) {},
    //文件上传时的钩子
    loadIng(event, file, fileTable) {},

    handleChange(val) {
      // console.log(val);
    },

    handleProgress(event, file, fileList) {
      this.uploadWork = fileList.length;
      // console.log(this.uploadWork)
    },

    handleAvatarSuccess(res, file) {
      //图片上传成功
      let img = res.msg[0].url;
      this.imgUrl.push(img);
      this.imgList.push(img);
      for (let i = 0; i < this.pictureName.length; i++) {
        if (this.pictureName[i].name == file.name) {
          this.pictureName.splice(i, 1);
        }
      }
    },

    handleRemove(file, fileList) {
      this.imgUrl = [];
      this.imgList = [];
      this.uploadWork = fileList.length;
      fileList.forEach(item => {
        if (item.response) {
          this.imgUrl.push(item.response.msg[0].url);
          this.imgList.push(item.response.msg[0].url);
        } else {
          this.imgUrl.push(item.url);
          this.imgList.push(item.url);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.imgeUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传之前钩子
    callBackBefore(file) {
      this.pictureName.push({ name: file.name });
    },
    /*//转换 fileList 到拼接 字符串类型 imgUrl, | 连接
    fileToImg (val) {
      this.imgUrl = '';
      for (let item of val) {
        this.imgUrl += item.url + '|';
      }
    },*/

    // save infos
    async saveInfos() {
      this.upImgRemarks();
      if (
        (this.imgUrl.length && this.imgUrl.length === this.uploadWork) ||
        this.remark ||
        this.imgList.length
      ) {
        this.uploadWork = 0; // ++++++++++++++++++++++++ deal the button click make the repeatedly submit the info to back-stage
        let params = {
          imageUrl: this.imgUrl.join("|"),
          mouldNo: this.$store.getters.mould_list.mouldNo,
          smallClass: this.$store.getters.details.serialNo,
          remark: this.remark,
          imageDescribe: this.upImgData
        };
        let res = await addCheckDetail(params);
        setTimeout(() => {
          this.uploadWork = 1;
        }, 1000);
        if (res.status === 1) {
          this.messageShow = false;
          Message({
            showClose: true,
            type: "success",
            message: "新增描述成功！"
          });
          this.imgUrl = [];
          this.activeNames = 0;
          this.fileList = [];
          this.url = [];
          //上传清空图片数据源
          this.imgList = [];
          //上传清空备注数据
          this.upImgData = "";
          this.getList();
          this.getDetail();
        }
      } else {
        Message({
          showClose: true,
          type: "warning",
          message: "请填写相关内容并耐心等待图片上传完成，谢谢！！"
        });
      }
    }
  },
  data() {
    return {
      allInfo: "",
      activeNames: 0,
      list: [],
      remark: "",
      dialogVisible: false,
      imgeUrl: "",
      imageUrl: "",
      fileList: [],
      uploadData: { path: "detail_pc" }, //上传时需要传递的额外参数
      imgUrl: [],

      // upload complete
      uploadWork: 1,
      // 留言板数据
      url: [],
      imgList: [],
      //下载列表数据
      fileTable: [],
      //文件上传时的参数
      dataObj: {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        classId: this.$store.getters.details.serialNo,
        type: 1
      },
      //总数据源
      fileDownLoadData: [],
      //左边下载地址数据源
      fileDataLeft: [],
      //右边下载地址数据源
      fileDataRight: [],
      messageShow: true,
      // 文件获取id
      id: "",
      //照片备注数据
      inputValue: {},
      //照片备注上传保存数据
      upImgData: "",
      // 下载弹窗bool值
      dialogVisibleForDownload: false,
      dialogVisibleForDownloadRight: false,
      // isActive: false
      loading: true,
      // 图片加载框数据
      pictureName: [],
      // 当前页面下载前缀地址
      downloadUrl: "",
      // 左边下载地址
      firstdownloadleft:'',
      // 右边下载地址
      seconddownloadright:''
    };
  }
};
</script>

<style lang="scss" scoped>
.btnStyle {
  display: inline-block;
  width: 59px;
  height: 28px;
  border-radius: 3px;
  text-decoration: none;
  color: #fff;
  background-color: rgba(64, 158, 255, 1);
  line-height: 28px;
  font-size: 12px;
}
.upStyle {
  width: 138px;
  height: 138px;
  border: 1px dashed #ccc;
  font-size: 25px;
  line-height: 138px;
  border-radius: 4px;
}
.imgSstyle {
  display: inline-block;
  flex: 2;
  width: 100px;
  height: 200px;
  padding: 6px;
  box-sizing: border-box;
  overflow: auto;
}
.showBox {
  height: 240px;
  display: block;
}
.showStyle {
  width: 100%;
  height: 138px;
  display: flex;
  margin-bottom: 5px;
  .showImgDiv {
    display: inline-block;
    height: 138px;
    width: 138px;
    border: 1px solid #ccc;
    border-radius: 3px;
    .showImgStyle {
      width: 100%;
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
      content: "×";
      top: 0;
      right: 0;
      font-size: 30px;
      position: absolute;
      cursor: pointer;
      color: #fff;
      background-color: #ccc;
    }
  }
}
.inputStyle {
  display: inline-block;
  height: 146px !important;
  flex: 6;
  margin-left: 3px;
}

.sideBar {
  display: inline-block;
  width: 3px;
  height: 9px;
  background: rgba(97, 163, 235, 1);
  border-radius: 1px;
  margin-left: 5px;
}
.dowmLoad {
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 2px;
  padding: 10px 15px;
  box-sizing: border-box;
  display: flex;
  .downloadList {
    list-style: none;
    width: 520px;
    height: 100%;
    padding: 0;
    margin: 0;
    flex: 1;
    li {
      line-height: 45px;
      .imga {
        display: inline-block;
        width: 13px;
        height: 13px;
        background: url("../assets/downloadfile.png");
        background-size: 100%;
        cursor: pointer;
      }
      img {
        display: inline-block;
        width: 13px;
        height: 13px;
        margin-left: 20px;
        background-size: 100%;
        cursor: pointer;
      }
    }
  }
  .downLoadTwoList {
    list-style: none;
    width: 510px;
    height: 100%;
    padding: 0;
    margin: 0;
    flex: 1;
    li {
      line-height: 45px;
      .imga {
        display: inline-block;
        width: 13px;
        height: 13px;
        background: url("../assets/downloadfile.png");
        background-size: 100%;
        cursor: pointer;
      }
      img {
        display: inline-block;
        width: 13px;
        height: 13px;
        margin-left: 20px;
        background-size: 100%;
        cursor: pointer;
      }
    }
  }
}
.stressing {
  line-height: 238px;
  text-align: center;
}
.flex_row_spaceBetween {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

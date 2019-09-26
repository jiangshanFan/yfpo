<template>
  <div class="designList_Edit_detail">
    <div class="title mb20">
      <span>
        <b>评审内容：</b>
      </span>
      <p v-html="allInfo.verification"></p>
    </div>

    <el-divider></el-divider>

    <el-row class="mb20">
      <el-col>
        <div class>
          <i class="sideBar"></i>
          <span class="topTitle">INFORMATION/REMARKS/ACTION:</span>
        </div>
        <!-- 新增留言展示区域 -->
        <el-col class="textStyle">
          <div class="newStyle">
            <div v-for="(item,index) in listData" :key="index">
              <div class="topHead">
                公司名称：
                <span>{{item.companyName}}</span>
                <span>用户名：{{item.name}}</span>
                <span>{{item.createTime}}</span>
              </div>
              <p>{{item.content}}</p>
            </div>
          </div>
          <div style="margin-top:15px;">
            <i class="sideBar"></i>
            <span class="topTitle">新增描述</span>
            <span style="margin-left:20px;">
              <el-button type="primary" size="mini" @click="subInfo">提交</el-button>
            </span>
          </div>
          <div style="margin-top:9px;">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              v-model="allInfo.remarks"
              maxlength="500"
              resize="none"
            ></el-input>
          </div>
        </el-col>
      </el-col>
    </el-row>

    <!-- 内容附件板块 -->
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
              :data="dataFile"
              name="files"
              multiple
              :file-list="fileTable"
              :before-upload="beforeUpload"
              ref="upload_content"
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
                  {{item.filename}}
                  <span style="margin-left:20px;">
                    <a class="imga" :href="item.url" :download="item.filename"></a>
                    <img src="../assets/deletefile.png" alt @click="deleteLeft(item.id)" />
                  </span>
                </li>
              </ul>
              <ul class="downLoadTwoList">
                <li v-for="(item,index) in fileDataRight" :key="index">
                  {{item.filename}}
                  <span style="margin-left:20px;">
                    <a class="imga" :href="item.url" :download="item.filename"></a>
                    <img src="../assets/deletefile.png" alt @click="deleteRight(item.id)" />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-col>
    </el-row>

    <!-- add -->
    <el-row class="boxShadow mb20">
      <!-- 评审标准 -->
      <el-row class="mt20">
        <div class="fwb">
          <i class="sideBar"></i>
          <span style="margin-left:5px;">评审标准：</span>
        </div>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3}"
          placeholder="请输入内容"
          v-model="allInfo.assessDescribe"
        ></el-input>

        <!-- list -->
        <el-row :gutter="20">
          <el-col class="ovwh mt20" :span="6" v-for="(img,ind) in allInfo.assessImage" :key="ind">
            <el-col class="imgContainer tc" ref="colorNone" style="border: 1px solid #ccc;">
              <!-- <img class="uploadImg" :src="img" alt="图片" /> -->
              <el-image :src="img" class="uploadImg" alt="图片">
                <div slot="placeholder" class="image-slot stressing">
                  <i class="el-icon-loading"></i>
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
              <span class="delete" @click="deleteImg(ind,1)"></span>
            </el-col>
          </el-col>

          <el-col class="ovwh mt20" :span="6" v-for="(type,index) in assessImage" :key="type+index">
            <el-col
              class="imgContainer tc"
              style="border: 1px solid #ccc;"
              v-loading="assessImageLoading"
            ></el-col>
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
                :on-progress="handleAssessProgress"
                :before-upload="handleAssessBeforeUpload"
                :data="uploadData"
                :file-list="fileList"
              >
                <p class="w100 imgContainer tc">
                  <img class="uploadLogo" src="../assets/upload_logo.png" alt="上传" />
                </p>
              </el-upload>
            </div>
          </el-col>
        </el-row>

        <el-divider></el-divider>
      </el-row>

      <!-- 模具现状 -->
      <el-row class="mt20">
        <div class="fwb">
          <i class="sideBar"></i>
          <span style="margin-left:5px;">模具现状：</span>
        </div>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3}"
          placeholder="请输入内容"
          v-model="allInfo.presentSituationDescribe"
        ></el-input>

        <!-- list -->
        <el-row :gutter="20">
          <el-col
            class="ovwh mt20"
            :span="6"
            v-for="(img,ind) in allInfo.presentSituationImage"
            :key="ind"
          >
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;">
              <!-- <img class="uploadImg" :src="img" alt="图片" /> -->
              <el-image :src="img" class="uploadImg" alt="图片">
                <div slot="placeholder" class="image-slot stressing">
                  <i class="el-icon-loading"></i>
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
              <span class="delete" @click="deleteImg(ind,2)"></span>
            </el-col>
          </el-col>

          <el-col
            class="ovwh mt20"
            :span="6"
            v-for="(type,index) in presentSituationImage"
            :key="type+index"
          >
            <el-col
              class="imgContainer tc"
              style="border: 1px solid #ccc;"
              v-loading="presentSituationImageLoading"
            ></el-col>
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
                :on-progress="handlePresentSituationProgress"
                :before-upload="handlePresentSituationBeforeUpload"
                :data="uploadData"
                :file-list="fileList"
              >
                <p class="w100 imgContainer tc">
                  <img class="uploadLogo" src="../assets/upload_logo.png" alt="上传" />
                </p>
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
        <div class="fwb">
          <i class="sideBar"></i>
          <span style="margin-left:5px;">改善后：</span>
        </div>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3}"
          placeholder="请输入内容"
          v-model="allInfo.improveDescribe"
        ></el-input>

        <!-- list -->
        <el-row :gutter="20">
          <el-col class="ovwh mt20" :span="6" v-for="(img,ind) in allInfo.improveImage" :key="ind">
            <el-col class="imgContainer tc" style="border: 1px solid #ccc;">
              <!-- <img class="uploadImg" :src="img" alt="图片" /> -->
              <el-image :src="img" class="uploadImg" alt="图片">
                <div slot="placeholder" class="image-slot stressing">
                  <i class="el-icon-loading"></i>
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
              <span class="delete" @click="deleteImg(ind,3)"></span>
            </el-col>
          </el-col>

          <el-col
            class="ovwh mt20"
            :span="6"
            v-for="(type,index) in improveImage"
            :key="type+index"
          >
            <el-col
              class="imgContainer tc"
              style="border: 1px solid #ccc;"
              v-loading="improveImageLoading"
            ></el-col>
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
                :on-progress="handleImproveProgress"
                :before-upload="handleImproveBeforeUpload"
                :data="uploadData"
                :file-list="fileList"
              >
                <p class="w100 imgContainer tc">
                  <img class="uploadLogo" src="../assets/upload_logo.png" alt="上传" />
                </p>
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
      <el-button type="primary" size="small" @click="saveInfos" :disabled="!canUpdate">提交</el-button>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  updateDesignInfo,
  getRemarkList,
  submitRemarks,
  getEnclosureList,
  deleteEnclosure
} from "../axios/api.js";
export default {
  name: "designList_Edit_detail",
  created() {
    this.allInfo = JSON.parse(
      JSON.stringify(this.$store.getters.design_details)
    );
    //评论区数据
    this.remarkData.mouldNo = this.allInfo.mouldNo;
    this.remarkData.reviewId = this.allInfo.reviewId;
    this.dataFile.mouldNo = this.allInfo.mouldNo;
    this.dataFile.classId = this.allInfo.id;
    //test
    // this.imgUrl = this.allInfo.assessImage? this.allInfo.assessImage : '';

    this.getList();

    this.assessWork = 0;
    this.presentSituationWork = 0;
    this.improveWork = 0;
    let store = this.$store.getters.design_details;
    let assess = 0,
      presentSituation = 0,
      improve = 0;
    if (store.assessImage) {
      if (store.assessImage.indexOf("|") === -1) {
        assess = 1;
      } else {
        assess = store.assessImage.split("|").length;
      }
    }
    if (store.presentSituationImage) {
      if (store.presentSituationImage.indexOf("|") === -1) {
        presentSituation = 1;
      } else {
        presentSituation = store.presentSituationImage.split("|").length;
      }
    }
    if (store.improveImage) {
      if (store.improveImage.indexOf("|") === -1) {
        improve = 1;
      } else {
        improve = store.improveImage.split("|").length;
      }
    }
    this.assess = assess;
    this.presentSituation = presentSituation;
    this.improve = improve;
  },
  mounted() {
    this.getList1();
  },
  methods: {
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
    //获取下载地址
    async getEnclosure() {
      let res = await getEnclosureList({
        mouldNo: this.allInfo.mouldNo,
        classId: this.allInfo.id,
        type: 2
      });
      if (res.status === 1) {
        this.fileDataRight = [];
        this.fileDataLeft = [];
        this.fileDownLoadData = [];
        res.msg.forEach(item => {
          let download =
            item.url + `?filename=${item.fileName.replace(/&/g, "")}`;
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
        this.$refs.upload_content.clearFiles();
      }
    },
    async getList1() {
      this.getEnclosure();
    },
    //提交接口
    async subInfo() {
      if (this.allInfo.remarks == "") {
        this.$message({
          type: "warning",
          message: "请输入之后提交",
          center: true
        });
        return;
      } else if (this.allInfo.remarks !== "") {
        let res = await submitRemarks({
          mouldNo: this.allInfo.mouldNo,
          reviewId: this.allInfo.reviewId,
          content: this.allInfo.remarks
        });
        if (res.status === 1) {
          this.allInfo.remarks = "";
          this.$message({
            type: "success",
            message: "提交成功",
            center: true
          });
          let params = this.remarkData;
          let res = await getRemarkList(params);
          if (res.status === 1) {
            this.listData = res.msg;
          }
        }
      }
    },
    // transfer string to img array
    StringToImg(val) {
      if (this.allInfo[val]) {
        let imgeUrl = this.allInfo[val];
        if (imgeUrl !== undefined && imgeUrl !== null && imgeUrl) {
          if (
            imgeUrl.length > 1 &&
            imgeUrl.charAt(imgeUrl.length - 1) === "|"
          ) {
            /** 需要先判断imgeUrl ！== null，才能获取length */ /*test:.map((item,index) => {return {url: item.url, name: index} })*/
            this.allInfo[val] = imgeUrl
              .substr(0, imgeUrl.length - 1)
              .split("|");
          } else {
            this.allInfo[val] = imgeUrl.split("|");
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
      this.allInfo.remarks = "";
      this.StringToImg("assessImage");
      this.StringToImg("presentSituationImage");
      this.StringToImg("improveImage");
      // this.fileList = [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      let params = this.remarkData;
      let res = await getRemarkList(params);
      if (res.status === 1) {
        this.listData = res.msg;
      }
    },

    //多附件上传区域
    //点击文件列表中已上传的文件时的钩子
    uploadList(file) {},
    //文件上传成功钩子
    uploadSuccess(res, file, fileTable) {
      this.getEnclosure();
    },
    beforeUpload(file) {},
    //文件列表移除文件时的钩子
    deleteList(res, file, fileTable) {},
    //文件上传时的钩子
    loadIng(event, file, fileTable) {},

    handleChange(val) {
      // console.log(val);
    },

    handleAssessBeforeUpload(file) {
      this.assessImageLoading = true;
      this.assessImage.push("assessImage");
    },

    // get the init length of upload file
    handleAssessProgress(event, file, fileList) {
      this.assessWork += 1;
      // console.log(this.uploadWork)
    },

    handleAssessAvatarSuccess(res, file) {
      //图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + "|"; // 存储上传成功后的图片地址
      this.allInfo.assessImage.push(img);
      this.assessImage.pop();

      if (this.assessImage.length === 0) {
        this.assessImageLoading = false;
      }
    },

    handlePresentSituationBeforeUpload(file) {
      this.presentSituationImageLoading = true;
      // console.log(file);
      this.presentSituationImage.push("presentSituationImageLoading");
      // console.log(this.improveImage);
    },

    // get the init length of upload file
    handlePresentSituationProgress(event, file, fileList) {
      this.presentSituationWork += 1;
      // console.log(this.uploadWork)
    },

    handlePresentSituationAvatarSuccess(res, file) {
      //图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + "|"; // 存储上传成功后的图片地址
      this.allInfo.presentSituationImage.push(img);
      this.presentSituationImage.pop();

      if (this.presentSituationImage.length === 0) {
        this.presentSituationImageLoading = false;
      }
    },

    handleImproveBeforeUpload(file) {
      this.improveImageLoading = true;
      // console.log(file);
      this.improveImage.push("improveImageLoading");
      // console.log(this.improveImage);
    },

    // get the init length of upload file
    handleImproveProgress(event, file, fileList) {
      this.improveWork += 1;
    },

    handleImproveAvatarSuccess(res, file) {
      //图片上传成功
      let img = res.msg[0].url;
      this.imgUrl += img + "|"; // 存储上传成功后的图片地址
      this.allInfo.improveImage.push(img);
      this.improveImage.pop();

      if (this.improveImage.length === 0) {
        this.improveImageLoading = false;
      }
    },

    deleteImg(key, type) {
      if (type === 1) {
        this.allInfo.assessImage.splice(key, 1);

        if (this.assessWork) {
          this.assess -= 1;
        } else if (this.assessWork) {
          this.assessWork -= 1;
        }
      } else if (type === 2) {
        this.allInfo.presentSituationImage.splice(key, 1);

        if (this.presentSituation) {
          this.presentSituation -= 1;
        } else if (this.presentSituationWork) {
          this.presentSituationWork -= 1;
        }
      } else if (type === 3) {
        this.allInfo.improveImage.splice(key, 1);

        if (this.improve) {
          this.improve -= 1;
        } else if (this.improveWork) {
          this.improveWork -= 1;
        }
      }
    },

    handleRemove(file, fileList) {
      this.fileToImg(fileList);
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.imgeUrl = file.url;
      this.dialogVisible = true;
    },
    //转换 fileList 到拼接 字符串类型 imgUrl, | 连接
    fileToImg(val) {
      for (let item of this.allInfo[val]) {
        this.allInfo[val] += item + "|";
      }
    },

    // save infos
    async saveInfos() {
      let store = this.$store.getters.design_details;
      let condition = true;
      this.canUpdate = false;
      setTimeout(() => {
        this.canUpdate = true;
      }, 1000);

      if (
        this.allInfo.remarks ||
        this.allInfo.assessDescribe ||
        this.allInfo.presentSituationDescribe ||
        this.allInfo.improveDescribe ||
        this.allInfo.assessImage.length ||
        this.allInfo.presentSituationImage.length ||
        this.allInfo.improveImage.length ||
        store.assessImage ||
        store.presentSituationImage ||
        store.improveImage
      ) {
        if (
          this.allInfo.remarks ||
          this.allInfo.assessDescribe ||
          this.allInfo.presentSituationDescribe ||
          this.allInfo.improveDescribe
        ) {
          condition = true;
        }

        if (this.assessWork || this.presentSituationWork || this.improveWork) {
          if (
            this.allInfo.assessImage.length === this.assessWork + this.assess &&
            this.allInfo.presentSituationImage.length ===
              this.presentSituationWork + this.presentSituation &&
            this.allInfo.improveImage.length === this.improveWork + this.improve
          ) {
            condition = true;
          } else {
            condition = false;
            Message({
              showClose: true,
              type: "warning",
              message: "请耐心等待图片上传完成，再点击提交！"
            });
          }
        }

        if (condition) {
          let allInfo = JSON.parse(
            JSON.stringify({
              ...this.allInfo,
              assessImage: this.allInfo.assessImage.join("|"),
              presentSituationImage: this.allInfo.presentSituationImage.join(
                "|"
              ),
              improveImage: this.allInfo.improveImage.join("|")
            })
          );
          let params = {
            mouldNo: this.$store.getters.mould_list.mouldNo,
            reviewList: [allInfo]
          };

          if (
            JSON.stringify(allInfo) !==
            JSON.stringify(this.$store.getters.design_details)
          ) {
            let res = await updateDesignInfo(params);
            if (res.status === 1) {
              Message({
                showClose: true,
                type: "success",
                message: "更新信息成功！"
              });
              // this.$store.dispatch('design_details',allInfo); 目前设计是更新后跳出当前页面，返回上一层，不需要更新vuex
              this.$emit("changed", "4-1");
            }
          } else {
            Message({
              showClose: true,
              type: "warning",
              message: "请更新相关内容，再点击提交！"
            });
          }
        }
      } else if (
        this.assessWork ||
        this.presentSituationWork ||
        this.improveWork
      ) {
        Message({
          showClose: true,
          type: "warning",
          message: "请耐心等待图片上传完成，再点击提交！"
        });
      } else {
        Message({
          showClose: true,
          type: "warning",
          message: "请至少填写一项相关内容，再点击提交！"
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
      uploadData: { path: "design_pc" }, //上传时需要传递的额外参数
      imgUrl: "",

      assessImageLoading: true,
      presentSituationImageLoading: true,
      improveImageLoading: true,
      assessImage: [],
      presentSituationImage: [],
      improveImage: [],
      assessWork: 0,
      presentSituationWork: 0,
      improveWork: 0,

      assess: 0,
      presentSituation: 0,
      improve: 0,

      // if update?
      canUpdate: true,
      //评论区数据
      remarkData: {
        mouldNo: "",
        reviewId: ""
      },
      //渲染页面数组
      listData: {},
      //下载列表数据
      fileTable: [],
      //文件上传时的参数
      dataFile: {
        mouldNo: "",
        classId: "",
        type: 2
      },
      //总数据源
      fileDownLoadData: [],
      //左边下载地址数据源
      fileDataLeft: [],
      //右边下载地址数据源
      fileDataRight: []
    };
  }
};
</script>

<style lang="scss" scoped>
.sideBar {
  display: inline-block;
  width: 3px;
  height: 9px;
  background: rgba(97, 163, 235, 1);
  border-radius: 1px;
  margin-left: 5px;
}
.topTitle {
  width: 169px;
  height: 8px;
  font-size: 9px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 14px;
}
.mb20 {
  .textStyle {
    width: 100%;
    height: 350px;
    .newStyle {
      margin-top: 10px;
      width: 100%;
      height: 250px;
      border: 1px solid #ccc;
      overflow: auto;
      padding: 15px 25px;
      box-sizing: border-box;
      word-break: break-all;
      word-wrap: break-word;
      .topHead {
        width: 700px;
        height: 36px;
        background: rgba(238, 242, 244, 1);
        line-height: 36px;
        border-radius: 5px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(42, 40, 40, 1);
        span:nth-child(2) {
          margin-left: 200px;
          font-weight: 400;
        }
        span:last-child {
          float: right;
          color: rgba(119, 119, 119, 1);
          font-weight: 400;
        }
      }
      p {
        margin-left: 25px;
      }
    }
  }
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
  line-height: 200px;
}
@media screen and (max-width: 960px) {
  .designList_Edit_detail {
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
      content: "×";
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

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d228cb0"],{db62:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:"添加店铺类别",visible:e.dialogFormVisible},on:{"update:visible":e.changeDialogFormVisible}},[a("el-form",{ref:"form",attrs:{model:e.form}},[a("el-form-item",{attrs:{prop:"shopTypeName",label:"类别名称","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.form.shopTypeName,callback:function(t){e.$set(e.form,"shopTypeName",t)},expression:"form.shopTypeName"}})],1),a("el-form-item",{attrs:{label:"类别图片",prop:"shopTypePic","label-width":e.formLabelWidth}},[a("el-upload",{ref:"shopTypePic",staticClass:"avatar-uploader",attrs:{name:"shopTypePic",action:"/ele/addShopType",data:e.form,"on-change":e.changePic,"auto-upload":!1,headers:{authorization:e.$store.state.admin.token},"show-file-list":!1,"on-success":e.handleAvatarSuccess}},[e.imageUrl?a("img",{staticClass:"avatar",attrs:{src:e.imageUrl}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){return e.changeDialogFormVisible(!1)}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.addShopType}},[e._v("添 加")])],1)],1)},s=[],i={name:"add-shop-type",props:["dialogFormVisible"],data(){return{imageUrl:"",formLabelWidth:"120px",form:{shopTypeName:""}}},mounted(){},methods:{changeDialogFormVisible(e){this.$emit("update:dialogFormVisible",e),this.imageUrl=""},addShopType(){this.$refs.shopTypePic.submit()},changePic(e){this.imageUrl=URL.createObjectURL(e.raw)},handleAvatarSuccess(e,t){"shopTypeList"===this.$route.name?this.$store.dispatch("getShopTypeList"):this.$router.push("/shopTypeList"),this.imageUrl="",this.$refs.shopTypePic.clearFiles(),this.$refs.form.resetFields(),this.changeDialogFormVisible(!1)}}},r=i,l=a("2877"),p=Object(l["a"])(r,o,s,!1,null,"7147e89b",null);t["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d228cb0.582b4292.js.map
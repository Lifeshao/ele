(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d216b29"],{c424:function(e,a,t){"use strict";t.r(a);var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"toolbar"},[t("el-pagination",{attrs:{background:"","current-page":e.$store.state.pageInfo.pageIndex,layout:"prev, pager, next","page-count":e.$store.state.pageInfo.pageSum},on:{"current-change":e.changePageIndex}})],1)},s=[],o={name:"page-info",props:["actionsName","params"],methods:{changePageIndex(e){const a={pageIndex:e};this.params&&Object.assign(a,this.params),this.$store.dispatch(this.actionsName,a)}},mounted(){this.changePageIndex(1)}},c=o,r=t("2877"),p=Object(r["a"])(c,n,s,!1,null,"309dc7bb",null);a["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d216b29.a80ce329.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-010e0f80"],{"5a3a":function(t,e,i){"use strict";var n=i("edb6"),s=i.n(n);s.a},edb6:function(t,e,i){},f6f8:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"list-item pr4 pl4 no-selectable",attrs:{"aria-haspopup":"true"},on:{click:function(e){return e.stopPropagation(),t.toggleVisibility(e)}}},[t._m(0),i("transition",{attrs:{tag:"div","enter-active-class":"animated faster slideInDown","leave-active-class":"animated faster slideOutUp",mode:"out-in"}},[t.isOpen?i("div",{staticClass:"bg-white wrapper pr12 pl12 cursor-regular"},[i("h2",{staticClass:"title"},[t._v(" Our Partners ")]),i("div",{staticClass:"sponsors-wrapper"},[t._l(t.premium,(function(e,n){return[i("div",{key:n,staticClass:"img-wrapper",on:{click:function(i){return t.setActiveCable({id:e._id,option:"organizations"})}}},[i("el-image",{staticClass:"img-sponsor",attrs:{src:e.logo,fit:"contain"}})],1)]}))],2)]):t._e()])],1)},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"flex align-items-center"},[t._v(" Our Partners "),i("i",{staticClass:"el-icon-arrow-down icon sm-icon ml1",attrs:{"aria-hidden":"true"}})])}],a=i("46cf"),r={name:"PremiumPartnersButton",data:function(){return{isOpen:!1}},computed:{premium:function(){return this.$store.state.premium}},mounted:function(){window.addEventListener("click",this.handleCloseSheet)},beforeDestroy:function(){window.removeEventListener("click",this.handleCloseSheet)},methods:{toggleVisibility:function(){this.isOpen=!this.isOpen},handleCloseSheet:function(){this.isOpen=!1},setActiveCable:function(t){return a["a"].$emit("close-trustedby"),this.$emit("item-selected",t)}}},o=r,c=(i("5a3a"),i("2877")),l=Object(c["a"])(o,n,s,!1,null,"4875dfd0",null);e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-010e0f80.ef98ee5b.js.map
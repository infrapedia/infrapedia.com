(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7aad3512"],{8457:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"text-center h-fit-full flex align-items-center",on:{click:function(e){return e.stopPropagation(),t.toggleVisibility(e)}}},[n("span",{staticClass:"drawer-opener"},[t._v("Trusted by")]),n("transition",{attrs:{tag:"div","enter-active-class":"animated faster slideInDown","leave-active-class":"animated faster slideOutUp",mode:"out-in"}},[t.isOpen?n("div",{staticClass:"wrapper flex bg-white h-fit-full w-fit-full pr6 pl6 align-items-center"},[n("h1",{staticClass:"title w34"},[t._v("Trusted by")]),n("div",{staticClass:"sponsors-wrapper"},t._l(t.sponsors,(function(e,s){return n("div",{key:s,staticClass:"img-wrapper"},[n("el-image",{staticClass:"img-sponsor w20 h16 no-selectable",attrs:{src:e.logo,fit:"scale-down"},on:{click:function(n){return t.loadOrg({id:e._id,option:"organizations"})}}})],1)})),0)]):t._e()])],1)},i=[],a=(n("96cf"),n("1da1")),r=n("46cf"),o=n("2c39"),c={data:function(){return{sponsors:[],isOpen:!1}},mounted:function(){this.loadTrustedBy(),window.addEventListener("click",this.handleCloseSheet),r["a"].$on("close-trustedby",this.handleCloseSheet)},beforeDestroy:function(){window.removeEventListener("click",this.handleCloseSheet)},methods:{loadTrustedBy:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["f"])();case 2:n=e.sent,n&&n.data&&n.data.r&&(t.sponsors=n.data.r);case 4:case"end":return e.stop()}}),e)})))()},loadOrg:function(t){return this.$emit("item-selected",t)},toggleVisibility:function(){this.isOpen=!this.isOpen},handleCloseSheet:function(){this.isOpen=!1}}},l=c,d=(n("d318"),n("2877")),u=Object(d["a"])(l,s,i,!1,null,"5d4229b7",null);e["default"]=u.exports},af80:function(t,e,n){},d318:function(t,e,n){"use strict";var s=n("af80"),i=n.n(s);i.a}}]);
//# sourceMappingURL=chunk-7aad3512.6dc15f20.js.map
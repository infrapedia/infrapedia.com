(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-770b74a4"],{"5cbe":function(t,e,s){},6707:function(t,e,s){"use strict";var a=s("5cbe"),i=s.n(a);i.a},b4ea:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"absolute mainw"},[s("el-popover",{attrs:{"visible-arrow":!1,placement:"bottom-start",width:"320",trigger:"manual",transition:"el-zoom-in-top"},model:{value:t.isListOpen,callback:function(e){t.isListOpen=e},expression:"isListOpen"}},[s("el-button",{attrs:{slot:"reference",round:"",type:"primary",title:"My terrestrial networks and subsea cables",id:"reference-toggler"},on:{click:t.toggleListVisibility},slot:"reference"},[s("fa",{staticClass:"mr1",attrs:{icon:["fas","bezier-curve"]}})],1),s("div",{staticClass:"list-wrapper bottom-shadow sm-round h-fit-content absolute w90 p4 mt4 flex row wrap",class:{dark:t.dark,light:!t.dark}},[s("header",{staticClass:"w-fit-full h8 text-right"},[s("span",{staticClass:"inline-block cursor-pointer",on:{click:t.toggleListVisibility}},[s("fa",{staticClass:"fs-large icon",attrs:{icon:["fas","times"]}})],1)]),s("ul",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"flex w-fit-full row wrap m0 p0",attrs:{role:"group"}},t._l(t.cablesList,(function(e,a){return s("li",{key:a,staticClass:"w-fit-full transition-all cursor-pointer bg-white no-outline mt4 mb4 pr4 pl4 h-fit",attrs:{role:"listitem"}},[s("div",{staticClass:"flex row pt5 pb4 pl2 pr2 nowrap justify-content-space-between align-items-center",on:{click:function(s){return t.loadCable(e._id)}}},[s("div",[s("strong",[s("p",{staticClass:"name m0 p0 mb1"},[s("fa",{attrs:{icon:t.getIcon(e.terrestrial)}}),t._v(" "+t._s(e.name)+" ")],1)]),s("small",{staticClass:"hidden-sm-and-down"},[t._v(" ID: "+t._s(e._id)+" ")])]),s("p",{staticClass:"m0 p0 status-text",class:{on:e.status,off:!e.status}},[t._v(" "+t._s(e.status?"On":"Off")+" ")])])])})),0),s("div",{staticClass:"mt2 mb2 w-fit-full flex row wrap justify-content-space-between  align-items-center"},[s("el-button",{staticClass:"create-btn p2 h10",attrs:{plain:"",type:"text"},on:{click:function(e){return t.headToCreationRoute("subsea")}}},[s("fa",{staticClass:"mr1",attrs:{icon:["fas","plus"]}}),t._v(" Create new subsea ")],1),s("el-button",{staticClass:"create-btn p2 h10",attrs:{plain:"",type:"text"},on:{click:function(e){return t.headToCreationRoute("terrestrial")}}},[s("fa",{staticClass:"mr1",attrs:{icon:["fas","plus"]}}),t._v(" Create new network ")],1)],1)])],1)],1)},i=[],n=(s("96cf"),s("1da1")),r=s("4686"),o=s("7c03"),l={name:"UserCablesButton",data:function(){return{isListOpen:!1,cablesList:[],loading:!1}},mixins:[r["a"]],computed:{dark:function(){return this.$store.state.isDark},getIcon:function(){return function(t){return t?["fas","bezier-curve"]:["fas","water"]}}},watch:{isListOpen:function(t){return t?this.getCablesList():void 0}},methods:{toggleListVisibility:function(){this.isListOpen=!this.isListOpen},getCablesList:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.loading=!0,e.t0=o["e"],e.next=4,t.$auth.getUserID();case 4:return e.t1=e.sent,e.t2={user_id:e.t1},e.next=8,(0,e.t0)(e.t2);case 8:s=e.sent,s&&s.data&&s.data.r&&(t.cablesList=s.data.r),t.loading=!1;case 11:case"end":return e.stop()}}),e)})))()},loadCable:function(t){return this.toggleListVisibility(),this.handleItemListSelection({option:"cable",id:t})},headToCreationRoute:function(t){return"subsea"===t?this.$router.push("/user/section/create?id=subsea"):this.$router.push("/user/section/create?id=terrestrial-network")}}},c=l,u=(s("6707"),s("2877")),p=Object(u["a"])(c,a,i,!1,null,"1e9a0750",null);e["default"]=p.exports}}]);
//# sourceMappingURL=chunk-770b74a4.1fda1e37.js.map
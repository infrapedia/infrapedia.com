(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-54a8b4a5"],{1269:function(a,t,e){"use strict";e.r(t);var s=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{directives:[{name:"show",rawName:"v-show",value:a.isVisible,expression:"isVisible"}],staticClass:"el-dialog__wrapper z-index120"},[e("transition",{attrs:{tag:"div",mode:"in-out",name:"animated faster","enter-active-class":"fadeInDown","leave-active-class":"fadeOutUp"}},[e("div",{directives:[{name:"show",rawName:"v-show",value:a.isVisible,expression:"isVisible"}],staticClass:"inner-wrapper el-dialog"},[e("div",{staticClass:"el-dialog__header"},[e("header",{staticClass:"w-fit-full p0"},[e("h1",{staticClass:"inline-block font-semibold fs-xlarge"},[a._v(" Viewing data: "+a._s(a.data.name)+" ")]),e("el-button",{staticClass:"el-dialog__headerbtn p0",attrs:{type:"text"},on:{click:function(t){return a.$emit("close")}}},[e("fa",{staticClass:"el-dialog__close el-icon el-icon-close",attrs:{icon:["fas","times"]}})],1)],1)]),e("div",{staticClass:"el-dialog__body"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:24}},[e("el-table",{attrs:{data:a.tableData,stripe:""}},[e("el-table-column",{attrs:{label:"Property"},scopedSlots:a._u([{key:"default",fn:function(t){return["rgDate"==t.row.property?e("p",{staticClass:"capitalize"},[a._v(" Register Date ")]):e("p",{staticClass:"capitalize"},[a._v(" "+a._s(t.row.property)+" ")])]}}])}),e("el-table-column",{attrs:{label:"Value"},scopedSlots:a._u([{key:"default",fn:function(t){return["phone"==t.row.property?e("a",{attrs:{href:"tel:"+t.row.value,target:"_blank"}},[a._v(" "+a._s(t.row.value)+" ")]):"message"==t.row.property?[e("div",{attrs:{id:"rawDataMsgColumn"}},[e("div",{domProps:{innerHTML:a._s(t.row.value)}})])]:e("p",[a._v(" "+a._s(t.row.value)+" ")])]}}])})],1)],1)],1)],1)])])],1)},i=[],l=(e("4de4"),e("caad"),e("d81d"),e("b64b"),e("2532"),e("2c8b")),r={name:"ViewDataDialog",props:{isVisible:{type:Boolean,required:!0},data:{type:Object,required:!0},acceptedKeys:{type:Array,required:!0}},data:function(){return{map:null,draw:null,tableData:[]}},computed:{dark:function(){return this.$store.state.isDark},customDialogClass:function(){return this.dark?"custom-dialog dark":"custom-dialog light"}},watch:{isVisible:function(a){a&&this.handleDataVisualization()}},mounted:function(){this.handleDataVisualization()},methods:{handleDataVisualization:function(){var a=this;this.data&&this.isVisible&&(this.tableData=Object.keys(this.data).map((function(t){return a.acceptedKeys.includes(t)&&t.includes("Date")?{property:t,value:a.data[t]?Object(l["a"])(a.data[t]):"no data"}:!!a.acceptedKeys.includes(t)&&{property:t,value:a.data[t]?a.data[t]:"no data"}})).filter((function(a){return a})))}}},n=r,o=(e("f191"),e("2877")),c=Object(o["a"])(n,s,i,!1,null,"7b6ef010",null);t["default"]=c.exports},e8f6:function(a,t,e){},f191:function(a,t,e){"use strict";var s=e("e8f6"),i=e.n(s);i.a}}]);
//# sourceMappingURL=chunk-54a8b4a5.51030b7d.js.map